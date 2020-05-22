import { css } from '../src/css-lit'
import { Renderer, SvelteRenderer } from '../src/main'
import monolithic from 'fela-monolithic'

Renderer.devClassNames = true
;(window as any).css = css
;(window as any).renderer = new Renderer({
  enhancers: [monolithic({prettySelectors: true})]
})
;(window as any).svrenderer = new SvelteRenderer({
  enhancers: [monolithic({prettySelectors: true})],
  defStyles: () => css`.red {color: red}`
})
;(window as any).scss = (window as any).svrenderer.getLiteralCSS()