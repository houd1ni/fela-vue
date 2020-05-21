import { createRenderer, combineRules, IRenderer } from 'fela'
import { render, rehydrate, renderToMarkup } from 'fela-dom'
import embedded from 'fela-plugin-embedded'
import prefixer from 'fela-plugin-prefixer'
import fallback from 'fela-plugin-fallback-value'
import unit from 'fela-plugin-unit'
import { filter, identity, compose, toPairs, type, fromPairs, map } from 'pepka'
import { AnyObject, Options } from './types'
import getRules from './fns/getRules'
import { memoize, types, isBrowser, emptyObject } from './utils'

const mergeProps = (
  defaults: Partial<Options>,
  opts: Partial<Options> = {}
) => compose(
  fromPairs,
  map(([k, v]) => {
    switch(type(v)) {
      case 'Array': return [k, [...v, ...(opts[k] || [])]]
      case 'Object': return [k, {...v, ...(opts[k] || {})}]
      default: return [k, opts[k] || v]
    }
  }),
  toPairs
)(defaults)

const defaultOpts: Options = {
  method: 'f',
  defStyles: undefined,
  plugins: [],
  enhancers: [],
  preset: { unit: [] },
  ssr: false
}

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
    } = mergeProps(defaultOpts, opts)
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
    this._mixin = filter(identity, {
      methods: {
        [method](propsOrRule: any, props: AnyObject = {}): string {
          return renderer.renderRule(
            combineRules(...getRules(
              memoize(() => fdefValue ? fdefValue(this) : emptyObject),
              this.style,
              propsOrRule,
              this
            )),
            props
          ) || undefined
        }
      },
      computed: fdef && {
        [fdefKey]() {
          return fdefValue(this)
        }
      }
    })
  }
}

export * from './css-lit'
export * from './svelte'
export {
  Renderer
}