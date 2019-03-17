import { AnyObject } from './types'
import { camelify } from './utils'

const join = (strings: string[], values: any[]) => {
  const len = strings.length
  let out = ''
  for(let i = 0; i < len; i++) {
    out += strings[i] + (values[i] == undefined ? '' : values[i])
  }
  return out
}

export const css = (() => {
  const ruleRe = /([}^\n])*?\s*([\w-]+)[:\s]+(.*?)([\n;]|{|(?=})|$)/g
  return (strings: string[], ...values: any[]) => {
    const out: AnyObject = {}
    let levelUp: AnyObject
    let current = out
    join(strings, values)
    .replace(ruleRe, (_rule, open, name, value, close, _offset, all) => {
      if(close == '{') {
        levelUp = current
        current[camelify(name)] = current = {}
      } else if(open == '}') {
        if(levelUp) {
          current = levelUp
          levelUp = null
        } else {
          throw new Error('Bad rule: ' + all)
        }
      } else {
        current[camelify(name)] = isNaN(value) ? value.trim() : +value
      }
      return ''
    })
    return out
  }
})()