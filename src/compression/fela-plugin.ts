
import { AnyObject } from 'pepka'
import { re } from '../utils'
import { getDics } from './fela-compress'

const sc = ';'
const sp = ' '

const prepareCompressRules = (dics: AnyObject, pepka: typeof import('pepka')) => {
  const { compose, replace, trim } = pepka
 
  return compose(
    replace(re.trailingSeps, '$2'),
    replace(re.repeatingSeps,  (s: string) => s.includes(sc) ? sc : sp),
    replace(re.trailing_ws, '$1'),
    replace(re.rule_free, (s: string, trailing: string, k: string, v: string) =>
      v
      ? trailing +
        (k&&v
        ? `${trim(dics.dic[k] || k)}:${trim(dics.dic[v] || v)};`
        : trim(k ? s.replace(k, dics.dic[k] || k)
          : v ? s.replace(k, dics.dic[v] || v)
            : s))
      : ''
    ),
    replace(re.comment, '')
  )
}

let dics: any = null

export const rollupCSSCompression = function() {
  return {
    name: 'fela-vue-compression',
    async transform(code: string) {
      const pepka = await import('pepka')
      const { compose, take, replace } = pepka
      if(!dics) dics = getDics(pepka)
      const compressRules = prepareCompressRules(dics, pepka)
      let res: string = ''
      try {
        res = code.replace(re.tliterals, compose(
          (a) => `css\`${compressRules(a)}\``,
          replace(re.interp, replace(re.eol, ' ')),
          take(1)
        ))
      } catch(e) { console.warn(e) }
      return { code: res || code, map: null }
    }
  }
}
