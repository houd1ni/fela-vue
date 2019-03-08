
import { createRenderer } from 'fela'
import { render } from 'fela-dom'
import presetWeb from 'fela-preset-web'

interface AnyObject {
  [key: string]: any
}

interface Options {
  method: string,
  fdef: (vm: AnyObject) => AnyObject
}

const renderer = createRenderer({ plugins: [ ...presetWeb ] })
render(renderer)

const defaultOpts = {
  method: 'f',
  fdef: (_vm: AnyObject) => ({})
}

export default (
  opts: Partial<Options>
) => {
  const { method, fdef } = { ...defaultOpts, ...opts }
  return {
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
    computed: {
      fdef() {
        return fdef(this)
      }
    }
  }
}