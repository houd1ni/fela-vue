
Instead of using it as in [the official fela doc](https://github.com/rofrischmann/fela/tree/master/packages/fela-monolithic)

```javascript
// Bad:
css`
  .my-class {
    className: class-belle
    margin: 10
  }
`
```

Please use this approach, because lit-css knows your class names already:
```javascript
// Good !
css`
  .my-class {
    margin: 10
  }
`
```

The main thing is to include [this fela enhancer](https://github.com/rofrischmann/fela/tree/master/packages/fela-monolithic) to the `enhancers` config prop:

```javascript
import { Renderer } from 'fela-vue'
import monolithic from 'fela-monolithic'

const renderer = new Renderer({
  enhancers: [ monolithic() ]
})
Vue.mixin(renderer.mixin)
```