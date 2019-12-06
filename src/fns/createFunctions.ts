import { StyleGenerator } from '../types'
import { css } from '../main'
import { curry, map, compose, join, last } from 'ramda'

const errorString = 'fela-vue literal: unbalanced delimeter in functional expression !'

/** returns first and last indexes of entries themselves. */
const findEntries = curry((
  [start, end]: [string, string],
  str: string
): [number, number][] => {
  let i: number, startI: number,
      str_len = str.length,
      delim_len = start.length,
      balance = 0,
      entries: [number, number][] = []
  for(i=0; i<str_len; i++) {
    switch(str.slice(i, i+delim_len)) {
      case start:
        i += delim_len - 1
        if(balance==0) {
          startI = i
        }
        balance++
        break
      case end:
        i += delim_len - 1
        balance--
        if(balance==0) {
          entries.push([startI, i])
        } else if(balance<0) {
          throw new Error(errorString)
        }
      default: break
    }
  }
  return entries
})

const injectExpressions = (line: string) => {
  const accum: string[] = []
  let lastI = 0
  for(let [from, to] of findEntries(['[', ']'], line)) {
    accum.push(
      line.slice(lastI, from),
      '${' + line.slice(from+1, to).replace(/\$([a-zA-Z_]+)\b/g, '$$.$1') + '}'
    )
    lastI = to+1
  }
  accum.push(line.slice(lastI))
  return accum.join('')
}

const intoExpression = compose(join('\n'), map(injectExpressions))

export const createFunctions = (lines: string[]) => {
  const out: (string|[string, StyleGenerator])[] = []
  let line: string, arrowI: number, selector: string,
      balance = 0, accum: string[] = []
  for(line of lines) {
    if(balance > 0) {
      switch(line) {
        case '{':
          balance++
          accum[accum.length-1] += line
          break
        case '}':
          if(--balance==1) {
            const gen = new Function(
              '_css,$',
              `return _css\`
                ${intoExpression(accum)}
              \``
            ) as StyleGenerator
            out.push([
              selector,
              ($, t) => gen.call(t, css, $)
            ])
            balance = 0
            accum.splice(0)
          } else {
            accum[accum.length-1] += line
          }
          break
        default:
          accum.push(line)
      }
    } else {
      arrowI = line.indexOf('=>')
      if(~arrowI) {
        balance = 1
        selector = line.slice(0, arrowI).trim().replace(/^\./, '')
      } else {
        out.push(line)
      }
    }
  }
  return out
}