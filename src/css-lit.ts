import { parse } from './fns/'
import { join } from './utils'

export const css = (() => {
  return (strings: (string[] | TemplateStringsArray), ...values: any[]) => {
    return parse(join(strings as string[], values))
  }
})()