import { StyleGenerator } from '../types'
// NEEDED in Function constructor below !
import { css as _css } from '../main'

export const createFunctions = (lines: string[]) => {
  const out: (string|[string, StyleGenerator])[] = []
  let line: string, arrowI: number, selector: string,
      balance = 0, accum: string[] = []
  for(line of lines) {
    if(balance > 0) {
      switch(line) {
        case '{': balance++; break
        case '}':
          if(--balance==1) {
            const gen = new Function(
              '_css,$',
              `return _css\`
                ${accum.join('\n')
                  .replace(
                    /\[(.*?)\]/g,
                    (_, expr) => '${' + expr.replace(/\b([a-zA-Z]+)\b/g, '$$.$1') + '}'
                  )
                }
              \``
            ) as StyleGenerator
            out.push([
              selector,
              ($) => gen(_css, $)
            ])
            balance = 0
            accum.splice(0)
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