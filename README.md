# fela-vue
Fela mixin for Vue designed for flexibility yet team-oriented.
[![Build Status](https://circleci.com/gh/houd1ni/fela-vue/tree/master.svg?style=shield)](https://circleci.com/gh/houd1ni/fela-vue/tree/master) [![codecov](https://codecov.io/gh/houd1ni/fela-vue/branch/master/graph/badge.svg)](https://codecov.io/gh/houd1ni/fela-vue) [![bundlephobia](https://badgen.net/bundlephobia/minzip/fela-vue)](https://bundlephobia.com/result?p=fela-vue)  [![npm](https://badgen.net/npm/v/fela-vue)](https://www.npmjs.com/package/fela-vue) [![Deps](https://david-dm.org/houd1ni/fela-vue.svg)](https://david-dm.org/houd1ni/fela-vue) [![DevDeps](https://david-dm.org/houd1ni/fela-vue/dev-status.svg)](https://david-dm.org/houd1ni/fela-vue)

**[Fela](https://github.com/rofrischmann/fela) does the great job, but it has no idea how to cook it with Vue.
This is what I've created after combining vue's :style and :class attributes to make apps dynamically configured and easiest to write and maintain.**

Included (but not in the bundle itself: you bundler & package manager should do it automatocally):
- [fela](https://github.com/rofrischmann/fela)
- [fela-dom](https://github.com/rofrischmann/fela/tree/master/packages/fela-dom)
- [fela-preset-web](https://github.com/rofrischmann/fela/tree/master/packages/fela-preset-web)


Usage:

## WITHOUT SSR
**main.js**
```javascript
import Vue from 'vue'
import { Renderer } from 'fela-vue'

Vue.mixin(
  (new Renderer({
    fdef: () => defaultStylesObject // not required. Default styles to mix.
    method: 'f', // not required. Name of styling method. Defaults to `f`.
    plugins: []  // not required. Additional fela plugins.
  })).mixin
)
```

## WITH SSR
**entry.server.js**
```javascript
import Vue from 'vue'
import { Renderer } from 'fela-vue'
// OR const { Renderer } = require('fela-vue')

const renderer = new Renderer({
  fdef: () => defaultStylesObject // not required. Default styles to mix.
  method: 'f', // not required. Name of styling method. Defaults to `f`.
  plugins: [],  // not required. Additional fela plugins.
  ssr: true
})

Vue.mixin(renderer.mixin)
```
**And just put `renderer.style` in your template.**

**entry.client.js**
```javascript
import Vue from 'vue'
import { Renderer } from 'fela-vue'

Vue.mixin(
  (new Renderer({
    fdef: () => defaultStylesObject // not required. Default styles to mix.
    method: 'f', // not required. Name of styling method. Defaults to `f`.
    plugins: [],  // not required. Additional fela plugins.
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
    <div v-for="i in [0,1,2]">
      <span
        :class="f((i) => ({color: ['green', 'blue', 'yellow'][i]}))"
      > This way is OK too. </span>
    </div>
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

It's better to make this computed in the end of a component definition or make a const variable at the bottom and return it from the computed prop.
Also, It's very handy to make snippets for adding style() {} to computed.
