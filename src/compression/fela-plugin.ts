
import { AnyObject } from 'pepka'
import { re } from '../utils'
import { getDics } from './fela-compress'

const prepareCompressRules = (dics: AnyObject, pepka: typeof import('pepka')) => {
  const { compose, replace  } = pepka
  return compose(
    replace(re.excessTrailingSeps, ''),
    replace(re.excessSeps, ';'),
    replace(re.senseless_lines, '\n'),
    replace(re.trailing_ws, '$1'),
    replace(re.comment, ''),
    replace(re.rule_free, (s: string, trailing: string, k: string, v: string) =>
      trailing +
      (k&&v
      ? `${dics.dic[k] || k}:${dics.dic[v] || v};`
      : k ? s.replace(k, dics.dic[k] || k)
        : v ? s.replace(k, dics.dic[v] || v)
          : s)
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
