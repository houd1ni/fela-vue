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

const analyseLine = (() => {
  const ruleRE = /^([\w-]+)(: *| +)(.*)$/
  const selectorRE = /^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/
  const delimRE = /\s*,\s*/g
  const trailingColonRE = /(.*):$/
  return (levels: AnyObject[], line: string, names: string[]) => {
    let groups: string[]
    const current = last(levels)
    switch(true) {
      case line=='{':
        const oo = {}
        names.forEach(name => current[name] = oo)
        levels.push(oo)
        break
      case line=='}':
        levels.pop()
        break
      case (groups = ruleRE.exec(line)) != null:
        current[camelify(groups[1])] = isNaN(groups[3] as any) ? groups[3] : +groups[3]
        break
      case (groups = selectorRE.exec(line)) != null:
        names.splice(0)
        names.push(...line.split(delimRE).map((selector) => {
          selector = selector.replace(trailingColonRE, '$1')
          if(selector[0] == '.') {
            selector = levels.length > 1
              ? '& ' + selector
              : selector.slice(1)
          }
          return selector
        }))
        break
    }
  }
})();

export const css = (() => {
  const delimiters = ['\n', '\r', ';']
  const isDelimiter = (s: string) => delimiters.includes(s)
  const delimRE = new RegExp(`[${delimiters.join('')}]`, 'g')
  const commentRE = /^\/\/.*$/
  return (strings: string[], ...values: any[]) => {
    const out: AnyObject = {}
    const names: string[] = [] // selector names, class names.
    const levels = [out]
    join(strings, values)
    .replace(/(\{|\})/g, (_, brace, offset, full) => {
      if(!isDelimiter(full[offset-1])) {
        brace = ';' + brace
      }
      if(!isDelimiter(full[offset+1])) {
        brace += ';'
      }
      return brace
    })
    .split(delimRE)
    .forEach((line) => {
      line = line.trim().replace(commentRE, '')
      if(line) {
        analyseLine(levels, line, names)
      }
      if(!levels.length) {
        throw new Error('lit-css parse error: unbalanced {} braces !')
      }
    })
    return out
  }
})()