import { createRenderer, combineRules, IRenderer } from 'fela'
import { render, rehydrate, renderToMarkup } from 'fela-dom'
import embedded from 'fela-plugin-embedded'
import fallback from 'fela-plugin-fallback-value'
import unit from 'fela-plugin-unit'
import { identity, compose, toPairs, type, fromPairs, map, mergeShallow, once, qfilter } from 'pepka'
import { AnyObject, RenderClasses, Options, Modifiers } from './types'
import {getRules, setClasses} from './fns'
import { types, isBrowser, emptyObject, preparePlugins } from './utils'

const mergeProps = (
  defaults: Partial<Options>,
  opts: Partial<Options> = {}
) => compose(
  fromPairs,
  map(([k, v]) => {
    switch(type(v)) {
      case 'Array': return [k, [...v, ...(opts[k] || [])]]
      case 'Object': return [k, {...v, ...(opts[k] || {})}]
      default: return [k, opts[k] || v]
    }
  }),
  toPairs
)(defaults)

const defaultOpts: Options = {
  method: 'f',
  defStyles: undefined,
  modifiers: {},
  plugins: [],
  enhancers: [],
  preset: { unit: [] },
  ssr: false,
  classNames: false
}


export class Renderer {
  private renderer: IRenderer
  private _mixin: AnyObject
  private renderClasses: RenderClasses

  /** Vue Composition API endpoint. */
  public styl: (stylesheet: AnyObject, modifiers?: Modifiers) => RenderClasses

  /** @returns Vue Options API mixin. */
  public get mixin(): AnyObject {
    return Object.freeze(this._mixin)
  }

  /** @returns Entire css for SSR proposes. */
  public get style(): string {
    return renderToMarkup(this.renderer)
  }

  /** Sets classes to DOM elements what match. Just like CSS. */
  public setClasses = setClasses

  constructor(opts: Partial<Options> = {}) {
    const {
      method,
      ssr,
      preset,
      plugins,
      enhancers,
      classNames,
      ...miscRenderOpts
    } = mergeProps(defaultOpts, opts)
    const presetConfig = { ...defaultOpts.preset, ...(preset || {}) }
    const thisRenderer = this

    // Fela renderer creation. 
    this.renderer = createRenderer({      
      ...miscRenderOpts,
      enhancers,
      plugins: preparePlugins([
        unit,
        embedded,
        fallback,
        ...plugins
      ], {0: presetConfig.unit})
    })
    const { renderer } = this

    // Default styles.
    const fdef = opts.defStyles as any
    let fdefKey: string, fdefValue: (vm?: AnyObject) => AnyObject 

    switch(typeof fdef) {
      case types.o: [fdefKey, fdefValue] = [fdef.key, fdef.value]; break
      case types.f: [fdefKey, fdefValue] = ['fdef', fdef]; break
      default: break
    }

    // Fela mounting.
    if(isBrowser)
      if(ssr) rehydrate(renderer)
      else render(renderer)

    this.renderClasses = (
      stylesheet: AnyObject,
      propsOrRule: any,
      props: AnyObject = emptyObject,
      modifiers?: Modifiers
    ): string => {
      const rules = getRules(
        once(() => fdefValue ? fdefValue(this) : emptyObject),
        stylesheet,
        propsOrRule,
        modifiers ? mergeShallow(opts.modifiers, modifiers) : opts.modifiers,
        classNames,
        props
      )
      return renderer.renderRule(
        combineRules(...rules),
        props
      )
    }

    // Should be bound to Renderer.
    this.styl = (stylesheet: AnyObject, modifiers?: Modifiers): RenderClasses =>
      (propsOrRule: any, props?: AnyObject, submodifiers?: Modifiers) =>
        this.renderClasses(
          stylesheet, propsOrRule, props,
          submodifiers ? mergeShallow(modifiers, submodifiers) : modifiers
        )

    // Mixin creation.
    this._mixin = qfilter(identity, {
      methods: {
        /** propsOrRule: any, props?: AnyObject */
        [method]: function(propsOrRule: any, props?: AnyObject, submodifiers?: Modifiers) {
          return thisRenderer.renderClasses
            .call(this, this.style, propsOrRule, props,
              submodifiers
              ? mergeShallow(opts.modifiers, submodifiers)
              : 'styleMods' in this && this.styleMods
            )
        } as RenderClasses
      },
      computed: fdef && {
        [fdefKey]() {
          return fdefValue(this)
        }
      }
    })
  }
}