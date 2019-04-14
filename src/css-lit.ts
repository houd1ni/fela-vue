import { AnyObject } from './types'
import { last, camelify } from './utils'

const join = (strings: string[], values: any[]) =>
  strings.reduce((accum, str, i) =>
    accum + str + (values[i] == undefined ? '' : values[i])
  , '')

/** Keeps the structure of CSS to navigate and change the tree. */
class Levels {
  private o: AnyObject = {}
  private path: AnyObject[][] = []
  public get out() {
    return this.o
  }
  public get depth() {
    return this.path.length
  }
  add(keys: string[]) {
    const curs = last(this.path)
    const newCurs = []
    keys.forEach((k) => {
      curs.forEach((cur) => {
        if(!cur[k]) {
          cur[k] = {}
        }
        newCurs.push(cur[k])
      })
    })
    this.path.push(newCurs)
  }
  merge(k: string, v: any) {
    last(this.path).forEach(o => {
      o[k] = v
    })
  }
  pop() {
    this.path.pop()
  }
  constructor() {
    this.path.push([ this.o ])
  }
}

const analyseLine = (() => {
  const ruleRE = /^([\w-]+)(: *| +)(.*)$/
  const selectorRE = /^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/
  const delimRE = /\s*,\s*/g
  const trailingColonRE = /(.*):$/
  return (levels: Levels, line: string, names: string[]) => {
    let groups: string[]
    switch(true) {
      case line=='{':
        levels.add(names)
        break
      case line=='}':
        levels.pop()
        break
      case (groups = ruleRE.exec(line)) != null:
        levels.merge(
          camelify(groups[1]),
          isNaN(groups[3] as any) ? groups[3] : +groups[3]
        )
        break
      case (groups = selectorRE.exec(line)) != null:
        names.splice(0)
        names.push(...line.split(delimRE).map((selector) => {
          selector = selector.replace(trailingColonRE, '$1')
          if(selector[0] == '.') {
            selector = levels.depth > 1
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
    const names: string[] = [] // selector names, class names.
    const levels = new Levels()
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
      if(levels.depth < 1) {
        throw new Error('lit-css parse error: unbalanced {} braces !')
      }
    })
    return levels.out
  }
})()