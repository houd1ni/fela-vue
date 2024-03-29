
import { AnyObject } from 'pepka'
import { re } from '../utils'
import { getDics } from './fela-compress'

const prepareCompressRules = (dics: AnyObject, pepka: typeof import('pepka')) => {
  const { compose, replace, trim } = pepka
  return compose(
    replace(re.trailingSeps, '$2'),
    replace(re.repeatingSeps, ';'),
    replace(re.senseless_lines, '\n'),
    replace(re.trailing_ws, '$1'),
    replace(re.comment, ''),
    replace(re.rule_free, (s: string, trailing: string, k: string, v: string) =>
      v
      ? trailing +
        (k&&v
        ? `${trim(dics.dic[k] || k)}:${trim(dics.dic[v] || v)};`
        : trim(k ? s.replace(k, dics.dic[k] || k)
          : v ? s.replace(k, dics.dic[v] || v)
            : s))
      : ''
    )
  )
}

let dics: any = null

export const rollupCSSCompression = function() {
  return {
    name: 'fela-vue-compression',
    async transform(code) {
      const pepka = await import('pepka')
      const { compose, take } = pepka
      if(!dics) dics = getDics(pepka)
      const compressRules = prepareCompressRules(dics, pepka)
      let res: string = code
      try {
        res = code.replace(/css\`((.|\s)*?)\`/g, compose(
          (g1) => `css\`${compressRules(g1)}\``,
          take(1)
        ))
      } catch(e) {
        console.warn(e)
      }
      return { code: res, map: null }
    }
  }
}
