import { createRenderer, combineRules, IRenderer } from 'fela'
import { render, rehydrate, renderToMarkup } from 'fela-dom'
import embedded from 'fela-plugin-embedded'
import prefixer from 'fela-plugin-prefixer'
import fallback from 'fela-plugin-fallback-value'
import unit from 'fela-plugin-unit'
import { filter, identity, compose, toPairs, type, fromPairs, map } from 'pepka'
import { AnyObject, RenderClasses, Options } from './types'
import {getRules, setClasses} from './fns'
import { memoize, types, isBrowser, emptyObject, tryNamedFn, preparePlugins } from './utils'

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
  plugins: [],
  enhancers: [],
  preset: { unit: [] },
  ssr: false
}


export class Renderer {
  /** To use with fela-monolithic enhancer. */
  static devClassNames = false
  private renderer: IRenderer
  private _mixin: AnyObject
  private renderClasses: RenderClasses

  /** Vue Composition API endpoint. */
  public styl: (stylesheet: AnyObject) => RenderClasses

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
      ...miscRenderOpts
    } = mergeProps(defaultOpts, opts)
    const presetConfig = { ...defaultOpts.preset, ...(preset || {}) }
    const thisRenderer = this

    if((opts as any).fdef) {
      throw new Error('fela-vue: Change deprecated `fdef` to `defStyles`!')
    }

    // Fela renderer creation. 
    this.renderer = createRenderer({      
      ...miscRenderOpts,
      enhancers,
      plugins: preparePlugins([
        unit,
        embedded,
        prefixer,
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
      props: AnyObject = {}
    ): string => {
      const [name, rules] = getRules(
        memoize(() => fdefValue ? fdefValue(this) : emptyObject),
        stylesheet,
        propsOrRule,
        this
      )
      return renderer.renderRule(
        tryNamedFn(
          combineRules(...rules),
          name,
          Renderer.devClassNames
        ),
        props
      ) || undefined
    }

    // Should be bound to Renderer.
    this.styl = (stylesheet: AnyObject): RenderClasses =>
      (...args: [any?, AnyObject?]) => this.renderClasses(stylesheet, ...args)

    // Mixin creation.
    this._mixin = filter(identity, {
      methods: {
        /** propsOrRule: any, props?: AnyObject */
        [method]: function(...args: any[]) {
          return thisRenderer.renderClasses
            .call(this, this.style, ...args)
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