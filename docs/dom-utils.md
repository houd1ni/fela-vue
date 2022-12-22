
# There are some helpers to manipulate DOM with no explicit f(classes) calls.

Setting fela styles to elements dound by selectors similarly to CSS ones,
but root "classes" or argument props, if not used with lit-css, are TAG selectors.
To find some more complex stuff, use modifiers like `.div.thisClass:hover` etc.
**It's safe to leave it as is during SSR, 'cause there's a check inside,
but it won't appear in SSR rendered stylesheet. Also it is not reactive. Yet.**
```javascript
// main.js
import { Renderer } from 'fela-vue'

const renderer = new Renderer()

renderer.setClasses(css`
  .html, .body {
    margin 0
    padding 0
    font-size 18px
  }
`)
```