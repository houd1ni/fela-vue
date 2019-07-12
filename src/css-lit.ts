import { AnyObject } from './types'
import { camelify, splitNonEscaped, escape, unescape } from './utils'
import { compose, replace, forEach, last, when } from 'ramda'

const join = (strings: string[], values: any[]) =>
  strings.reduce((accum, str, i) =>
    accum + str + (values[i] || '')
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
    for(const k of keys) {
      for(const cur of curs) {
        if(!cur[k]) {
          cur[k] = {}
        }
        newCurs.push(cur[k])
      }
    }
    this.path.push(newCurs)
  }
  merge(k: string, v: any) {
    if(v && k) {
      for(const o of last(this.path)) {
        o[k] = v
      }
    }
  }
  pop() {
    return this.path.pop()
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
  const getValue = (value: string) => {
    switch(value) {
      case 'undefined': case '': return undefined
      case 'null': return null
      default: return isNaN(+value) ? value : +value
    }
  }
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
          unescape(camelify(groups[1])),
          when(isNaN, unescape, getValue(groups[3]))
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
})()

const parse = (() => {
  const delimiters = ['\n', '\r', ';']
  const isDelimiter = (s: string) => delimiters.includes(s)
  const commentRE = /((^\s*?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm
  return (css: string) => {
    const levels = new Levels()
    const names: string[] = [] // selector names, class names.
    return (compose as any)(
      () => levels.out,
      forEach((line: string) => {
        line = line.trim()
        if(line) {
          analyseLine(levels, line, names)
        }
        if(levels.depth < 1) {
          throw new Error('lit-css parse error: unbalanced {} braces !')
        }
      }),
      (a) => {
        console.log(a)
        return a
      },
      splitNonEscaped(delimiters),
      replace(/(\{|\})/g, (_, brace, offset, full) => {
        if(!isDelimiter(full[offset-1])) {
          brace = ';' + brace
        }
        if(!isDelimiter(full[offset+1])) {
          brace += ';'
        }
        return brace
      }),
      (a) => {
        console.log(a)
        return a
      },
      escape,
      replace(commentRE, '')
    )(css)
  }
})()

export const css = (() => {
  return (strings: (string[] | TemplateStringsArray), ...values: any[]) => {
    return parse(join(strings as string[], values))
  }
})()