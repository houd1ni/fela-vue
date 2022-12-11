
# SSR example.

**`entry.server.js` is the same as `entry.client.js`**
```typescript
// main.js
import Vue from 'vue'

// Not required tho.
const options = {}

const renderer = new Renderer({
  ...options,
  // SSR status to `true`.
  ssr: true
})

// if Options API.
Vue.mixin(renderer.mixin)
// For Vue 3:
// createApp(App).mixin(stylesRenderer.mixin).mount('#app')
```
**Then just put `renderer.style` into your template.**