import { camelify, unescape } from '../utils'
import { when, compose, fromPairs, map, reverse, toPairs } from 'pepka'
import { Levels } from '../classes/Levels'
import { getDics } from '../compression/fela-compress'

let compression = false
export const setCompression = (to: boolean) => compression=to
const dics = getDics({ compose, fromPairs, map, reverse, toPairs })

export const analyseLine = (() => {
  const ruleRE = /^([\w-]+)(: *| +)(.*)$/
  const selectorRE = /^(([\|~\$@>\*\.:&\(\)\^="\-\[\]]+).*[ ,]*)+:?$/
  const spreadRE = /\.\.\.(\S*)$/
  const delimRE = /\s*,\s*/g
  const trailingColonRE = /(.*):$/
  const decompress = when(() => compression, (s) => dics.dicRev[s] || s)
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
      case (groups = spreadRE.exec(line)) !== null:
        const cls = levels.findClass(groups[1])
        if(cls) for(const name in cls.rules)
          levels.merge(name, cls.rules[name])
        break
      case (groups = ruleRE.exec(line)) !== null:
        levels.merge(
          unescape(camelify(decompress(groups[1]))),
          when(isNaN, unescape, getValue(decompress(groups[3])))
        )
        break
      case (groups = selectorRE.exec(line)) !== null:
        names.splice(0)
        names.push(...line.split(delimRE).map((selector) =>
          selector.replace(trailingColonRE, '$1')
        ))
        break
    }
  }
})()