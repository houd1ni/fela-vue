import { camelify, emptyObject, re, types } from "../utils"
import { always, identity, compose, split, qmap, qfilter, all, last, slice, length, head, tail, qassoc, when, eq } from "pepka"
import { AnyObject, ModifierCondition } from "../types"
import { TRule } from "fela"

const classModRE = re.class_mod
const notMark = '!'
const empty_str = ''

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
  qmap((name: string) => [
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
  qfilter((s) => s!==empty_str),
  split(/[,\s\t]+/g)
)(names)

const addClassName = qassoc('className')
const addName = (name?: string) => compose(
  when(always(name), addClassName(name)),
  when(eq(emptyObject), always({})) // Base emptyObject is frozen.
)

export const getRules = (
  getDefStyle: () => AnyObject,
  style: AnyObject | undefined,
  propsOrRule: any,
  modifiers: {[name: string]: ModifierCondition},
  classNames: boolean,
  context: AnyObject,
  name?: string
): TRule[] => {
  if(!style) style = emptyObject
  switch(typeof propsOrRule) {
    case types.f:
      // TODO: Better document them, the usecases?
      const an = addName(name)
      return [(props: AnyObject) => an(propsOrRule(props, context))]
    case types.o:
      return [addName(name)(propsOrRule)]
    case types.s:
      const rules = []
      let combined_name = name || ''
      for(const [name, rule] of pickStyles(getDefStyle, style, propsOrRule, modifiers, context)) {
        if(classNames && name) {
          combined_name += (length(combined_name) ? '-' : '') + name
          addName(combined_name)(rule)
        }
        rules.push(...getRules(getDefStyle, style, rule, modifiers, classNames, context, combined_name))
      }
      return rules
    default:
      return [identity]
  }
}