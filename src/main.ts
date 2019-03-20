import { AnyObject, Options } from './types'
import { createRenderer, combineRules, IRenderer } from 'fela'
import { render, rehydrate, renderToMarkup } from 'fela-dom'
import embedded from 'fela-plugin-embedded'
import prefixer from 'fela-plugin-prefixer'
import fallback from 'fela-plugin-fallback-value'
import unit from 'fela-plugin-unit'
import { always, reflect, camelify, memoize } from './utils'

const isObject = (a: any) => typeof a == 'object'
const emptyObject = Object.freeze({})

const isBrowser = (() => {
  try {
    return isObject(window)
  } catch {
    return false
  }
})()

const defaultOpts = {
  method: 'f',
  defStyles: undefined,
  plugins: [],
  enhancers: [],
  preset: { unit: [] },
  ssr: false
}

const types = Object.freeze({ f: 'function', o: 'object', s: 'string' })

const getRules = (() => {
  const pickStyle = (style: AnyObject, name: string) => {
    return style[name] || style[camelify(name)]
  }
  const pickStyles = (getDefStyle: () => AnyObject, style: AnyObject, names: string) => {
    return names.split(/[,\s\t]+/g).map((name) =>
      pickStyle(style, name) || pickStyle(getDefStyle(), name) || emptyObject
    )
  }

  return (
    getDefStyle: () => AnyObject,
    style: AnyObject | undefined,
    propsOrRule: any
  ) => {
    if(!style) {
      style = emptyObject
    }
    switch(typeof propsOrRule) {
      case types.f:
        return [propsOrRule]
      case types.o:
        return [always(propsOrRule)]
      case types.s:
        return pickStyles(getDefStyle, style, propsOrRule).reduce(
          (accum, rule) => {
            accum.push(...getRules(getDefStyle, style, rule))
            return accum
          }
        , [] as (() => AnyObject)[])
      default:
        return [reflect]
    }
  }
})()


class Renderer {
  private renderer: IRenderer
  private _mixin: AnyObject
  public get mixin(): AnyObject {
    return Object.freeze(this._mixin)
  }
  public get style(): string {
    return renderToMarkup(this.renderer)
  }
  constructor(opts: Partial<Options> = {}) {
    const {
      method,
      ssr,
      preset,
      plugins,
      enhancers,
      ...miscRenderOpts
    } = { ...defaultOpts, ...opts }
    const presetConfig = { ...defaultOpts.preset, ...(preset || {}) }

    if((opts as any).fdef) {
      throw new Error('fela-vue: Change deprecated `fdef` to `defStyles`!')
    }

    // Fela renderer creation. 
    this.renderer = createRenderer({      
      ...miscRenderOpts,
      enhancers,
      plugins: [
        embedded(),
        prefixer(),
        fallback(),
        unit(...presetConfig.unit),
        ...plugins
      ]
    })
    const { renderer } = this

    // Default styles.
    const fdef = opts.defStyles as any
    let fdefKey: string, fdefValue: (vm?: AnyObject) => AnyObject 

    switch(typeof fdef) {
      case types.o: [fdefKey, fdefValue] = [fdef.key, fdef.value]; break
      case types.f: [fdefKey, fdefValue] = ['fdef', fdef]; break
      default: break
    }

    // Fela mounting.
    if(isBrowser) {
      if(ssr) {
        rehydrate(renderer)
      } else {
        render(renderer)
      }
    }

    // Mixin creation.
    this._mixin = {
      methods: {
        [method](propsOrRule: any, props: AnyObject = {}): string {
          return renderer.renderRule(
            combineRules(...getRules(
              memoize(() => fdefValue ? fdefValue(this): emptyObject),
              this.style,
              propsOrRule)
            ),
            props
          )
        }
      },
      computed: fdef ? {
        [fdefKey]() {
          return fdefValue(this)
        }
      } : {}
    }
  }
}

export * from './css-lit'
export {
  Renderer
}