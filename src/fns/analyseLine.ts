import { camelify, unescape } from '../utils'
import { when } from 'ramda'
import { Levels } from '../classes/Levels'

export const analyseLine = (() => {
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