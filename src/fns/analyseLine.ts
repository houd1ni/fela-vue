import { camelify, re, unescape } from '../utils'
import { when, compose, fromPairs, map, qreverse, toPairs, replace, split, test, ifElse } from 'pepka'
import { Levels } from '../classes/Levels'
import { getDics } from '../compression/fela-compress'

let compression = false
export const setCompression = (to: boolean) => compression=to
const dics = getDics({ compose, fromPairs, map, qreverse, toPairs })

export const analyseLine = (() => {
  const ruleRE = re.rule
  const selectorRE = re.selector
  const spreadRE = re.spread
  const delimRE = re.delim
  const mediaRE = re.media
  const trailingColonRE = re.trailing_colon
  const decompress = when(() => compression, (s) => dics.dicRev[s] || s)
  const getValue = (value: string) => {
    switch(value) {
      case 'undefined': case 'false': case '': return undefined
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
        names.push(...compose(
            map(replace(trailingColonRE, '$1')),
            ifElse(test(mediaRE), (l: string) => [l], split(delimRE))
          )(line)
        )
        break
    }
  }
})()