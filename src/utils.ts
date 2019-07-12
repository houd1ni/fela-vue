import {
  replace, when, isNil, complement, map, length
} from 'ramda'

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
        i += delims_lns[j]
        last_index = i
      }
    }
  }
  if(last_index !== str.length-1) {
    out.push(str.slice(last_index))
  }
  return out
}
export const splitByGroup = (re: RegExp, groupN: number) => (str: string) => {
  const savedLastIndex = re.lastIndex
  let groups: string[] | null
  let lastIndex = 0
  let part: string
  const accum: string[] = []
  while((groups = re.exec(str)) !== null) {
    part = groups[groupN] || ''
    accum.push(str.slice(lastIndex, re.lastIndex-part.length))
    lastIndex = re.lastIndex
  }
  if(lastIndex < str.length) {
    accum.push(str.slice(lastIndex))
  }
  re.lastIndex = savedLastIndex
  return accum
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