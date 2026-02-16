import monolithic from 'fela-monolithic';
import { __specialcss, css } from '../src/css-lit';
import { Renderer, setCompression, SvelteRenderer } from '../src/main';

(window as any).setCompression = setCompression
;(window as any).css = css
;(window as any).specialcss = __specialcss
;(window as any).renderer = new Renderer({
  enhancers: [monolithic({prettySelectors: true})]
})
;(window as any).svrenderer = new SvelteRenderer({
  enhancers: [monolithic({prettySelectors: true})],
  defStyles: () => css`.red {color: red}`
})
;(window as any).scss = (window as any).svrenderer.getLiteralCSS()