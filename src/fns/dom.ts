import { AnyObject, fromPairs, isNil, type } from "pepka"
import { RenderClasses } from "../types"
import { Renderer } from '../Renderer'

// TODO: make it reactive by caching classes added by it.
export const setClasses = function(
  this: Renderer, sheet: AnyObject, root?: NodeList
) {
  if(!isNil(window) && !isNil(window.document))
    for(const tag in sheet) {
      const rules = sheet[tag]
      const simpleRules: [string, any][] = []
      for(const p in rules) {
        const rule = rules[p]
        if(type(rule) == 'Object') // p is a subselector.
          this.setClasses(rule, document.querySelectorAll(tag+p))
        else // p is a rule
          simpleRules.push([p, rule])
      }
      if(simpleRules.length) {
        const renderClasses: RenderClasses = (this as any).renderClasses
        const classes = renderClasses(null, fromPairs(simpleRules)).split(' ')
        ;(root || document.querySelectorAll(tag))
          .forEach((el: Element) => el.classList.add(...classes))
      }
    }
}