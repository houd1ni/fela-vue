import { parse } from './fns/'
import { join } from './utils'

// TODO: make this inside of a ww.
const _css = (aug: boolean) => {
  return (strings: (string[] | TemplateStringsArray), ...values: any[]) => {
    return parse(join(strings as string[], values), aug)
  }
}

export const css = _css(false)
export const __specialcss = _css(true)