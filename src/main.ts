
import { createRenderer } from 'fela'
import { render } from 'fela-dom'
import presetWeb from 'fela-preset-web'
import * as isBrowser from 'is-browser'

interface AnyObject {
  [key: string]: any
}

interface Options {
  method: string,
  fdef: (vm: AnyObject) => AnyObject,
  ssr: boolean
}

const defaultOpts = {
  method: 'f',
  fdef: (_vm: AnyObject) => ({}),
  ssr: false
}

class Renderer {
  public renderer = createRenderer({ plugins: [ ...presetWeb ] })
  public mixin: AnyObject
  constructor(opts: Partial<Options> = {}) {
    const { method, fdef, ssr } = { ...defaultOpts, ...opts }
    if(isBrowser) {
      if(ssr) {
        require('fela-dom').rehydrate(this.renderer)
      } else {
        render(this.renderer)
      }
    }
    this.mixin = {
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
          return this.renderer.renderRule(rule, props)
        }
      },
      computed: {
        fdef() {
          return fdef(this)
        }
      }
    }
  }
}

const getStyle = (mixin: Renderer) =>
  require('fela-dom').renderToMarkup(mixin.renderer)

export {
  Renderer, getStyle
}