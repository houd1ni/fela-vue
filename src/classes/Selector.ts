import { AnyObject } from "../types"

export interface SelectorSet {
  className: string | null
  modifier: string
}

export class Selector {
  public readonly s: SelectorSet
  public rules: AnyObject = {}
  public get complex() {
    return this.s.className!==null && this.s.modifier!==null
  }
  public serialize(): string {
    const { className, modifier } = this.s
    return (className ? `.${className}` : '') + (modifier||'')
  }
  constructor(selector: string) {
    const cls = selector.match(/\.[\w-_]+/)
    this.s = {
      className: cls ? cls[0].slice(1) : null,
      modifier: cls ? selector.slice(cls[0].length)||null : selector
    }
  }
}