import { camelify, emptyObject, types } from "../utils"
import { always, identity, AnyFunc } from "pepka"
import { AnyObject } from "../types"

const pickStyle = (style: AnyObject, name: string) => {
  return style[name] || style[camelify(name)]
}
const pickStyles = (
  getDefStyle: () => AnyObject,
  style: AnyObject,
  names: string
): [string, AnyObject][] =>
  names.split(/[,\s\t]+/g).map((name) => [
    name,
    pickStyle(style, name) || pickStyle(getDefStyle(), name) || emptyObject
  ])

const getRules = (
  getDefStyle: () => AnyObject,
  style: AnyObject | undefined,
  propsOrRule: any,
  context: AnyObject
): [string, AnyFunc[]] => {
  if(!style) {
    style = emptyObject
  }
  switch(typeof propsOrRule) {
    case types.f:
      return [
        propsOrRule.name,
        [(props: AnyObject) => propsOrRule(props, context)]
      ]
    case types.o:
      return [propsOrRule.className, [always(propsOrRule)]]
    case types.s:
      const styles = pickStyles(getDefStyle, style, propsOrRule)
      const names = []
      const rules = []
      for(const [name, rule] of styles) {
        names.push(name)
        rules.push(
          ...getRules(getDefStyle, style, rule, context)[1]
        )
      }
      return [names.join('_'), rules]
    default:
      return ['', [identity]]
  }
}

export default getRules