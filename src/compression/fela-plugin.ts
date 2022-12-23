
import { AnyObject } from 'pepka'
import { re } from '../utils'
import { getDics } from './fela-compress'

const prepareCompressRules = (dics: AnyObject, pepka: typeof import('pepka')) => {
  const { compose, replace  } = pepka
  const ruleRE = re.rule_free
  const trailingRE = re.trailing_ws
  const senselessRE = re.senseless_lines
  const commentRE = re.comment
  return compose(
    replace(senselessRE, '\n'),
    replace(trailingRE, '$1'),
    replace(commentRE, ''),
    replace(ruleRE, (s: string, trailing: string, k: string, v: string) =>
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
      if(!dics) dics = getDics(pepka)
      const compressRules = prepareCompressRules(dics, pepka)
      let res: string = code
      try {
        res = code.replace(/css\`((.|\s)*?)\`/g, (_, g1) =>
          `css\`${compressRules(g1)}\``
        )
      } catch(e) {
        console.warn(e)
      }
      return { code: res, map: null }
    }
  }
}
