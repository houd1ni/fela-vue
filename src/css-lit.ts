import { AnyObject } from './types'
import { last, camelify } from './utils'

const join = (strings: string[], values: any[]) => {
  const len = strings.length
  let out = ''
  for(let i = 0; i < len; i++) {
    out += strings[i] + (values[i] == undefined ? '' : values[i])
  }
  return out
}

export const css = (() => {
  const ruleRe = /([}^\n])*?\s*([\w->*:]+)[:\s]+(.*?)([\n;]|{|(?=})|$)/g
  return (strings: string[], ...values: any[]) => {
    const out: AnyObject = {}
    let current = out
    const levels: AnyObject[] = []
    join(strings, values)
    .replace(ruleRe, (_rule, start, name, value, end, _offset, all) => {
      if(start == '}') {
        if(levels.length) {
          current = levels.pop()
        } else {
          throw new Error('Bad rule: ' + all)
        }
      }
      if(end == '{') {
        levels.push(current)
        const o = {}
        current[camelify(name)] = o
        current = o
      }
      const hasColon = name.includes(':')
      if(value || hasColon) {
        if(!value && hasColon) {
          const parts = name.split(':')
          name = parts.slice(0, -1).join(':')
          value = last(parts)
        } else {
          name = name.slice(0, -1)
        }
        if(name && value) {
          current[camelify(name)] = isNaN(value) ? value.trim() : +value
        }
      }
      return ''
    })
    return out
  }
})()