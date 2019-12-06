import { TPlugin, TEnhancer } from 'fela'

export interface AnyObject {
  [key: string]: any
}

export interface Options {
  method: string,
  defStyles?: ((vm: AnyObject) => AnyObject) | {
    key: string
    value: ((vm?: AnyObject) => AnyObject)
  }
  preset: { unit: [string, AnyObject] | [] }
  plugins: TPlugin[]
  enhancers: TEnhancer[]
  ssr: boolean
}

export type StyleGenerator = (t: AnyObject, css: Function, $: AnyObject) => AnyObject