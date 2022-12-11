
To make generated classes easy to read, please include [this fela enhancer](https://github.com/rofrischmann/fela/tree/master/packages/fela-monolithic) to the `enhancers` config prop:

```javascript
// main.js
import { Renderer } from 'fela-vue'
import monolithic from 'fela-monolithic'

const renderer = new Renderer({
  enhancers: [ monolithic() ]
})

// if Options API.
Vue.mixin(renderer.mixin)
```