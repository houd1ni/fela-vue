import { last, AnyObject, qmergeDeep } from 'pepka'
import { Selector } from './Selector'
import { valuable } from '../utils'

const extractRules = (s: Selector, depth=0): AnyObject => {
  const o: AnyObject = {}
  let tmp: Selector | string, full: string,
      key: string, newRules: AnyObject, k: string
  for(k in s.rules) {
    tmp = s.rules[k]
    if(Selector.isSelector(tmp)) {
      tmp = tmp as Selector // will get erased by minifier.
      full = tmp.complex ? tmp.s.className : tmp.serialize()
      key = (depth==0 && full[0]=='.')
        ? full.slice(1)
        : full[0]=='.' ? `& ${full}` : full
      newRules = tmp.complex
        ? { [tmp.s.modifier]: extractRules(tmp, depth+1) }
        : extractRules(tmp, depth+1)
      if(o[key]) qmergeDeep(o[key], newRules)
      else o[key] = newRules
    } else o[k] = tmp
  }
  return o
}

/** Keeps the structure of CSS to navigate and change the tree. */
export class Levels {
  private path: Selector[][] = []
  public get out() {
    return extractRules(this.path[0][0])
  }
  public get depth() {
    return this.path.length
  }
  public add(selectors: string[]) {
    const curSelectors = last(this.path)
    const newCurs: Selector[] = []
    for(const rawSel of selectors) {
      const sel = new Selector(rawSel)
      for(const curSel of curSelectors) {
        const fullSelector = sel.serialize()
        const old = curSel.rules[fullSelector]
        newCurs.push(old || sel)
        if(!old) {
          curSel.rules[fullSelector] = sel
        }
      }
    }
    this.path.push(newCurs)
  }
  public merge(k: string, v: any) {
    if(valuable(v) && valuable(k)) {
      for(const o of last(this.path)) {
        o.rules[k] = v
      }
    }
  }
  public findClass(name: string): Selector | null {
    for(const group of this.path)
      for(const s of group) {
        const res = s.findClass(name)
        if(res) return res
      }
    return null
  }
  pop() {
    return this.path.pop()
  }
  constructor() {
    this.path.push([ new Selector('__root') ])
  }
}