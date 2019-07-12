import {
  replace, when, isNil, complement, map, length
} from 'ramda'
import both from 'ramda/es/both';
import isEmpty from 'ramda/es/isEmpty';

export const camelify = (str: string) => str.replace(/-(\w)/gu, (_s, l) => l.toUpperCase())
export const memoize = (fn: Function) => {
  let cache: any
  let cached = false
  return () => cached ? cache : (cached = true, cache = fn())
}
export const splitNonEscaped = (delims: string[]) => (str: string): string[] => {
  const delims_lns: number[] = map(length as any, delims)
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