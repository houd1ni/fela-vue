import { camelify, splitNonEscaped, escape, unescape, join } from './utils'
import { compose, replace, forEach, when } from 'ramda'
import { Levels } from './classes/Levels'

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
        names.push(...line.split(delimRE).map((selector) =>
          selector.replace(trailingColonRE, '$1')
        ))
        break
    }
  }
})()

const parse = (() => {
  const delimiters = ['\n', '\r', ';']
  const isDelimiter = (s: string) => delimiters.includes(s)
  const commentRE = /(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm
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
      escape,
      replace(commentRE, ''),
    )(css)
  }
})()

export const css = (() => {
  return (strings: (string[] | TemplateStringsArray), ...values: any[]) => {
    return parse(join(strings as string[], values))
  }
})()