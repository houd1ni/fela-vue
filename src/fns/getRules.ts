import { AnyObject } from "lafetch"
import { camelify, emptyObject, types } from "../utils"
import { always, identity } from "ramda"

const pickStyle = (style: AnyObject, name: string) => {
  return style[name] || style[camelify(name)]
}
const pickStyles = (getDefStyle: () => AnyObject, style: AnyObject, names: string) => {
  return names.split(/[,\s\t]+/g).map((name) =>
    pickStyle(style, name) || pickStyle(getDefStyle(), name) || emptyObject
  )
}

const getRules = (
  getDefStyle: () => AnyObject,
  style: AnyObject | undefined,
  propsOrRule: any,
  context: AnyObject
) => {
  if(!style) {
    style = emptyObject
  }
  switch(typeof propsOrRule) {
    case types.f:
      return [(props: AnyObject) => propsOrRule(props, context)]
    case types.o:
      return [always(propsOrRule)]
    case types.s:
      return pickStyles(getDefStyle, style, propsOrRule).reduce(
        (accum, rule) => {
          accum.push(...getRules(getDefStyle, style, rule, context))
          return accum
        }
      , [] as (() => AnyObject)[])
    default:
      return [identity]
  }
}

export default getRules