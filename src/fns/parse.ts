
import { splitNonEscaped, escape } from '../utils'
import { compose, replace, forEach, type, tap } from 'ramda'
import { Levels } from '../classes/Levels'
import { analyseLine } from './analyseLine'
import { createFunctions } from './createFunctions'
import { StyleGenerator } from '../types'

export const parse = (() => {
  const delimiters = ['\n', '\r', ';']
  const isDelimiter = (s: string) => delimiters.includes(s)
  const commentRE = /(([\s^]+?\/\/.*$)|\/\*(.|[\n\r])*?\*\/)/gm
  return (css: string) => {
    const levels = new Levels()
    const names: string[] = [] // selector names, class names.
    return (compose as any)(
      () => levels.out,
      forEach((line: string | [string, StyleGenerator]) => {
        if(type(line) == 'Array') {
          levels.merge(line[0], line[1])
        } else {
          line = (line as string).trim()
          if(line) {
            analyseLine(levels, line, names)
          }
          if(levels.depth < 1) {
            throw new Error('lit-css parse error: unbalanced {} braces !')
          }
        }
      }),
      createFunctions,
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
      replace(commentRE, '')
    )(css)
  }
})()
