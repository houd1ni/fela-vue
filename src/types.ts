import { TPlugin, TEnhancer } from 'fela'

export interface AnyObject {
  [key: string]: any
}

export type ModifierCondition = (className: string, context: AnyObject) => boolean
export interface Modifiers {[name: string]: ModifierCondition}

export interface Options {
  method: string,
  defStyles: ((vm: AnyObject) => AnyObject) | {
    key: string
    value: ((vm?: AnyObject) => AnyObject)
  }
  modifiers: { [name: string]: ModifierCondition }
  preset: { unit: [string, AnyObject] | [] }
  plugins: TPlugin[]
  enhancers: TEnhancer[]
  ssr: boolean
}

export type StyleGenerator = (t: AnyObject, css: Function, $: AnyObject) => AnyObject
export type RenderClasses = (
  base: AnyObject|string|null,
  propsOrRule?: any,
  props?: AnyObject,
  modifiers?: Modifiers
) => string