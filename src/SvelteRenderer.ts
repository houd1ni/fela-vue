import { Renderer, css } from './main'
import { Options, AnyObject } from './types'
import { AnyFunc } from 'pepka'

export class SvelteRenderer extends Renderer {
  static get devClassNames() {
    return Renderer.devClassNames
  }
  /** To use with fela-monolithic enhancer. */
  static set devClassNames(x) {
    Renderer.devClassNames = x
  }
  private f: Function
  private fdef: Function
  public getCSS() {
    return (rules: AnyObject) => {
      const context = { style: rules, fdef: this.fdef }
      return (
        className: string | AnyObject | AnyFunc,
        attrs?: AnyObject
      ) => this.f.call(context, className, attrs)
    }
  }
  public getLiteralCSS() {
    const rulz = this.getCSS()
    return (...template: [string[]]) => rulz(css(...template))
  }
  constructor(opts: Partial<Options> = {}) {
    super(opts)
    const mixin = this.mixin
    this.f = mixin.methods.f
    this.fdef = typeof opts.defStyles == 'function'
      ? mixin.computed.fdef
      : opts.defStyles && mixin.computed[opts.defStyles.key]
  }
}