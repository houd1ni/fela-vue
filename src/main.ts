import { createRenderer, combineRules, IRenderer } from 'fela'
import { render, rehydrate, renderToMarkup } from 'fela-dom'
import embedded from 'fela-plugin-embedded'
import prefixer from 'fela-plugin-prefixer'
import fallback from 'fela-plugin-fallback-value'
import unit from 'fela-plugin-unit'
import { clearEmpty } from 'lafetch'
import { AnyObject, Options } from './types'
import getRules from './fns/getRules'
import { memoize, types, isBrowser, emptyObject } from './utils'

const defaultOpts = {
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
    this._mixin = clearEmpty({
      methods: {
        [method](propsOrRule: any, props: AnyObject = {}): string {
          return renderer.renderRule(
            combineRules(...getRules(
              memoize(() => fdefValue ? fdefValue(this): emptyObject),
              this.style,
              propsOrRule,
              this
            )),
            props
          ) || undefined
        }
      },
      computed: fdef ? {
        [fdefKey]() {
          return fdefValue(this)
        }
      } : ''
    })
  }
}

export * from './css-lit'
export {
  Renderer
}