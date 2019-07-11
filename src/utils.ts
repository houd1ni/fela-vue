export const camelify = (str: string) => str.replace(/-(\w)/gu, (_s, l) => l.toUpperCase())
export const memoize = (fn: Function) => {
  let cache: any
  let cached = false
  return () => cached ? cache : (cached = true, cache = fn())
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
export const unescape = (() => {
  const re = /([^\\])\\([^\\])/g
  return (v: string): string =>
    v.replace(re, '$1$2')
})()