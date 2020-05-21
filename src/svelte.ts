import { Renderer, css } from './main'
import { Options, AnyObject } from './types'
import { AnyFunc } from 'pepka'

export class SvelteRenderer {
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
    return (...template: [string[]]) => {
      const context = { style: css(...template), fdef: this.fdef }
      return (
        className: string | AnyObject | AnyFunc,
        attrs?: AnyObject
      ) => this.f.call(context, className, attrs)
    }
  }
  constructor(opts: Partial<Options> = {}) {
    const renderer = new Renderer(opts)
    const mixin = renderer.mixin
    this.f = mixin.methods.f
    this.fdef = typeof opts.defStyles == 'function'
      ? mixin.computed.fdef
      : opts.defStyles && mixin.computed[opts.defStyles.key]
  }
}