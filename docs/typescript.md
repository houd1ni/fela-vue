
# Typescript example.

```typescript
// main.ts
import Vue from 'vue'
import { Renderer, Options, AnyObject } from 'fela-vue'
// OR const { Renderer } = require('fela-vue')

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    f: (cls: string | AnyObject, ...ss: any[]) => string,
    fdef: AnyObject
  }
}

const options: Partial<Options> = {}

const renderer = new Renderer({ ...options })

// if Options API.
Vue.mixin(renderer.mixin)
// For Vue 3:
// createApp(App).mixin(stylesRenderer.mixin).mount('#app')
```