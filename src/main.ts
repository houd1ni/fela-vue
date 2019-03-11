
import { createRenderer, IRenderer } from 'fela'
import { render, rehydrate, renderToMarkup } from 'fela-dom'
import embedded from 'fela-plugin-embedded'
import prefixer from 'fela-plugin-prefixer'
import fallback from 'fela-plugin-fallback-value'
import unit from 'fela-plugin-unit'

const isObject = (a: any) => typeof a == 'object'

const isBrowser = (() => {
  try {
    return isObject(window)
  } catch {
    return isObject(global)
  }
})()

interface AnyObject {
  [key: string]: any
}

interface Options {
  method: string,
  defStyles?: ((vm?: AnyObject) => AnyObject) | {
    key: string
    value: ((vm?: AnyObject) => AnyObject)
  }
  preset: { unit: [string, AnyObject] | [] }
  plugins: any[]
  ssr: boolean
}

const defaultOpts = {
  method: 'f',
  defStyles: undefined,
  plugins: [],
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
    const { method, ssr, preset, plugins } = { ...defaultOpts, ...opts }
    const presetConfig = { ...defaultOpts.preset, ...(preset || {}) }

    if((opts as any).fdef) {
      throw new Error('fela-vue: Change deprecated `fdef` to `defStyles`!')
    }

    // Fela renderer creation. 
    this.renderer = createRenderer({
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
    let fdefKey: string, fdefValue: Function 

    if(fdef) {
      ;[fdefKey, fdefValue] = {
        'object': [fdef.key, fdef.value],
        'function': ['fdef', fdef]
      }[typeof fdef]
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
          const rule = ({
            'function': propsOrRule,
            'object': () => propsOrRule,
            'string': (() => {
              const rule = this.style && (this.style as any)[propsOrRule]
              return ({
                'function': rule,
                'object': () => rule,
              } as any)[typeof rule] || ((props: AnyObject) => props)
            })()
          } as any)[typeof propsOrRule]
          return renderer.renderRule(rule, props)
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

export {
  Renderer
}