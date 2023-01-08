import {
  replace, when, isNil, complement, map, length, both, toPairs,
  isEmpty, compose, equals, type, AnyFunc, ifElse, identity, prop
} from 'pepka'

export const emptyObject = Object.freeze({})
export const types = Object.freeze({ f: 'function', o: 'object', s: 'string' })
export const camelify = (str: string) => str.replace(/-(\w)/gu, (_s, l) => l.toUpperCase())
export const memoize = (fn: Function) => {
  let cache: any
  let cached = false
  return () => cached ? cache : (cached = true, cache = fn())
}
export const splitNonEscaped = (delims: string[]) => (str: string): string[] => {
  const delims_lns: number[] = map(length as (d: string) => number, delims)
  const out: string[] = []
  let i: number, j: number,
      last_index = 0,
      delims_count = delims.length,
      str_len = str.length
  for(i=0; i<str_len; i++) {
    for(j=0; j<delims_count; j++) {
      if(
        str.slice(i, i+delims_lns[j]) === delims[j]
        && str[i-1] !== '\\'
      ) {
        out.push(str.slice(last_index, i))
        i += delims_lns[j]-1
        last_index = i+1
      }
    }
  }
  if(last_index !== str.length-1) {
    out.push(str.slice(last_index))
  }
  return out
}
export const escape = (() => {
  const patternRE = /url\(.*?\)/g
  const signsRE = /[,:;]/g
  return (v: string): string =>
    v.replace(patternRE, (v) =>
      v.replace(signsRE, (s) => `\\${s}`)
    )
})()
export const unescape = when(
  complement(isNil),
  replace(/([^\\])\\([^\\])/g, '$1$2')
)
export const valuable = both(
  complement(isEmpty),
  complement(isNil)
)
export const join = (strings: string[], values: any[]) =>
  strings.reduce((accum, str, i) => 
    accum + str + (values.length>i ? values[i] : '')
  , '')

export const isObject = compose(equals('Object'), type)
export const isWindow = compose(equals('Window'), type)

export const tryNamedFn = (rule: AnyFunc, name: string, useNamed: boolean) => {
  if(useNamed && name && name!=='anonymous') {
    const tmpObj = {
      [name]: (props?: any, renderer?: any) => rule(props, renderer)
    }
    return tmpObj[name]
  } else return rule
}

export const isBrowser: boolean = (() => {
  try {
    return isWindow(window)
  } catch {
    return false
  }
})()

const tryUnwrap = map(ifElse(
  compose(equals('Function'), type),
  identity,
  prop('default')
))
type PluginArgsMap = {[i: number]: any[]}
const callWith = (
  args: PluginArgsMap,
  i: number,
  fn: AnyFunc
) => fn(...(args[i] || []))

export const preparePlugins = (
  plugins: (AnyFunc | {default: AnyFunc})[],
  args: PluginArgsMap
) =>
  compose(
    map(([i, p]) => callWith(args, i, p)),
    toPairs,
    tryUnwrap
  )(plugins)

export const re = {
  comment: /((\s+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm,
  senseless_lines: /[\n\r]{2,}|(?:;\s)/g,
  trailing_ws: /(^|\r|\n)+[\t ]+/g,
  excessSeps: /[;\n\r]+/g,
  excessTrailingSeps: /(?:(}|{|]|)^[;\n\r ]+)|(?:[;\n\r ]+($|}|{|]))/g,
  rule: /^([\w-]+)(: *| +)(.*)$/,
  rule_free: /(^|\r|\n|;|{)\s*([a-z-]+)[ :][\t ]*?:?[\t ]*?([^;\r\n]+)/g,
  selector: /^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/,
  spread: /^\.\.\.(\S*)$/,
  delim: /\s*,\s*/g,
  trailing_colon: /(.*):$/
}