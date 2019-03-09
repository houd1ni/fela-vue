# fela-vue
Fela mixin for Vue designed for flexibility yet team-oriented.

**Fela did the great job, but it has no idea how to cook it with Vue.
This is what I've created after combining vue's :style and :class attributes to make apps dynamically configured and easiest to write and maintain.**

Included (but not in the bundle itself: you bundler & package manager should do it automatocally):
- fela
- fela-dom
- fela-preset-web
- fela-preset-dev (COMING SOON for only development ENV.)

Usage:

## WITHOUT SSR
**main.js**
```javascript
import { Renderer } from 'fela-vue'

Vue.mixin(
  (new Renderer({
    fdef: () => defaultStylesObject // not required. Default styles to mix.
    method: 'f' // not required. Name of styling method. Defaults to `f`.
  })).mixin
)
```

## WITH SSR
**entry.server.js**
```javascript
import { Renderer, getStyle } from 'fela-vue'
// OR const { Renderer, getStyle } = require('fela-vue')

const renderer = new Renderer({
  fdef: () => defaultStylesObject // not required. Default styles to mix.
  method: 'f', // not required. Name of styling method. Defaults to `f`.
  ssr: true
})

Vue.mixin(renderer.mixin)

// After all rendering put getStyle(renderer) output in your template's <head />.
```

**entry.client.js**
```javascript
import { Mixin } from 'fela-vue'

Vue.mixin(
  (new Mixin({
    fdef: () => defaultStylesObject // not required. Default styles to mix.
    method: 'f', // not required. Name of styling method. Defaults to `f`.
    ssr: true
  })).mixin
)
```

## Component example
**MyComponent.vue**
```vue
<template>
  <div :class="f('wrapper')">
    <span :class="f('one')"> It's green! </span>
    <span :class="f('two')"> It's cyan! </span>
    <span :class="f('three', {color: 'white'})"> you don't see me! </span>
    <span :class="f({color: 'yellow'})"> I do it by myself! </span>
  </div>
</template>

<script>
export default {
  computed: {
    styles() {
      return {
        one: {
          color: 'green'
        },
        two: {
          color: 'cyan'
        },
        three: ({color}) => {
          fontWeight: 'bold',
          color
        }
      }
    }
  }
}
</script>
```

It's better to make this computed in the end of a component defenition or make a const variable at the bottom and return it from the computed prop.
