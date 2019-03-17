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
  const ruleRe = /[^\n]\s*([\w-]+)[:\s]+(.+?)[\n;$]/g
  return (strings: string[], ...values: any[]) => {
    const out: AnyObject = {}
    join(strings, values)
    .replace(ruleRe, (_rule, name, value, _delimiter) => {
      out[camelify(name)] = isNaN(value) ? value.trim() : +value
      return ''
    })
    return out
  }
})()