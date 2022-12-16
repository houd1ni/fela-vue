import { AnyObject } from "../types"

export interface SelectorSet {
  className: string | null
  modifier: string
}

export class Selector {
  public readonly s: SelectorSet
  public rules: AnyObject = {}
  // @ts-disable-next it is being read in Selector.isSelector()
  private readonly __selector__ = true
  public get complex() {
    return this.s.className!==null && this.s.modifier!==null
  }
  static isSelector(x: Selector | any) {
    return Boolean(x && x.__selector__)
  }
  public serialize(): string {
    const { className, modifier } = this.s
    return (className ? `.${className}` : '') + (modifier||'')
  }
  public findClass(name: string, s = this) {
    if(s.s.className === name)
      return s
    else for(const ruleName in s.rules) {
      const rule = s.rules[ruleName]
      if(Selector.isSelector(rule)) {
        const res = rule.findClass(name)
        if(res) return res
      }
    }
    return null
  }
  constructor(selector: string) {
    const cls = selector.match(/^\.[\w-_]+/)
    this.s = {
      className: cls ? cls[0].slice(1) : null,
      modifier: cls ? selector.slice(cls[0].length)||null : selector
    }
  }
}