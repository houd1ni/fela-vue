import { StyleGenerator } from '../types'

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
            out.push([
              selector,
              new Function(
                '$',
                `return css\`
                  ${accum.join('\n')
                    .replace(
                      /\[(.*?)\]/g,
                      (_, expr) => '${' + expr.replace(/\b([a-zA-Z]+)\b/g, '$$.$1') + '}'
                    )
                  }
                \``
              ) as StyleGenerator
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