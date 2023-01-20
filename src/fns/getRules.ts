import { camelify, emptyObject, re, types } from "../utils"
import { always, identity, AnyFunc, compose, split, qmap, qfilter, all, last, slice, length, head, tail } from "pepka"
import { AnyObject, ModifierCondition } from "../types"

const classModRE = re.class_mod
const notMark = '!'

// TODO: modifiers reactivity ?..
const pickStyle = (style: AnyObject, name: string) =>
  style[name] || style[camelify(name)]
const pickStyles = (
  getDefStyle: () => AnyObject,
  style: AnyObject,
  names: string,
  modifiers: {[name: string]: ModifierCondition},
  context: AnyObject
): [string, AnyObject][] => compose(
  qmap((name) => [
    name,
    pickStyle(style, name) || pickStyle(getDefStyle(), name) || emptyObject
  ]),
  qmap(last),
  qfilter((mods_and_name: string[]) => {
    if(length(mods_and_name)<2) return true
    const className = last(mods_and_name)
    let mod: ModifierCondition, invert: boolean, res: boolean
    return all(
      (mod_name: string) => {
        invert = head(mod_name)===notMark
        if(invert) mod_name = tail(mod_name)
        mod = modifiers[mod_name]
        if(!mod) throw new Error(`[fela-vue] Class modifier with name ${mod_name} not found.`)
        res = mod(className, context)
        return invert ? !res : res
      },
      slice(0, -1, mods_and_name) as string[]
    )
  }),
  qmap(split(classModRE)),
  split(/[,\s\t]+/g)
)(names)

export const getRules = (
  getDefStyle: () => AnyObject,
  style: AnyObject | undefined,
  propsOrRule: any,
  modifiers: {[name: string]: ModifierCondition},
  context: AnyObject
): [string, AnyFunc[]] => {
  if(!style) style = emptyObject
  switch(typeof propsOrRule) {
    case types.f:
      return [
        propsOrRule.name,
        [(props: AnyObject) => propsOrRule(props, context)]
      ]
    case types.o:
      return [propsOrRule.className, [always(propsOrRule)]]
    case types.s:
      const styles = pickStyles(getDefStyle, style, propsOrRule, modifiers, context)
      const names = []
      const rules = []
      for(const [name, rule] of styles) {
        names.push(name)
        rules.push(
          ...getRules(getDefStyle, style, rule, modifiers, context)[1]
        )
      }
      return [names.join('_'), rules]
    default:
      return ['', [identity]]
  }
}