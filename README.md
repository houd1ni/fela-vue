# fela-vue
Fela mixin for Vue designed for flexibility yet team-oriented.

[![Build Status](https://circleci.com/gh/houd1ni/fela-vue/tree/master.svg?style=shield)](https://circleci.com/gh/houd1ni/fela-vue/tree/master) [![codecov](https://codecov.io/gh/houd1ni/fela-vue/branch/master/graph/badge.svg)](https://codecov.io/gh/houd1ni/fela-vue) [![bundlephobia](https://badgen.net/bundlephobia/minzip/fela-vue)](https://bundlephobia.com/result?p=fela-vue)  [![npm](https://badgen.net/npm/v/fela-vue)](https://www.npmjs.com/package/fela-vue) [![Deps](https://david-dm.org/houd1ni/fela-vue.svg)](https://david-dm.org/houd1ni/fela-vue) [![DevDeps](https://david-dm.org/houd1ni/fela-vue/dev-status.svg)](https://david-dm.org/houd1ni/fela-vue)

**[Fela](https://github.com/rofrischmann/fela) does the great job, but it has no idea how to cook it with Vue.
This is what I've created after combining vue's :style and :class attributes to make apps dynamically configured and easiest to write and maintain.**

Included as deps:
- [fela](https://github.com/rofrischmann/fela)
- [fela-dom](https://github.com/rofrischmann/fela/tree/master/packages/fela-dom)
- [fela-plugin-embedded](https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-embedded)
- [fela-plugin-prefixer](https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-prefixer)
- [fela-plugin-fallback-value](https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-fallback-value)
- [fela-plugin-plugin-unit](https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-plugin-unit)

*The plugins are a lite most useful part of fela-preset-web.*


## USAGE

```javascript

const options = {
  // Not required. Default styles to mix. Does not mix if omitted.
  // Either pass a function (then key would be `fdef`):
  defStyles: (componentInstance) => ({ colors: { cyan: 'cyan' } }),
  // ... Or an object with your own key:
  defStyles: {
    key: 'fdef',
    value: (componentInstance) => ({ colors: { cyan: 'cyan' } })
  },
  // Not required. Name of styling method. Defaults to `f`.
  method: 'f',
  // Not required. Additional fela plugins. Several basic are built'in here!
  // [More info and list of them.](https://fela.js.org/docs/advanced/Plugins.html)
  plugins: [],
  // Not required. Additional fela enhancers.
  // [More info and list of them.](https://fela.js.org/docs/advanced/Enhancers.html)
  enhancers: [],
  // Not required. Preset configurations.
  preset: {
    // Not required. Config for fela-plugin-plugin-unit. Same defaults ('px', {}).
    unit: ['em', { margin: '%' }]
  },
  // SSR status.
  ssr: false
}

const renderer = new Renderer(options)

// Use globally
Vue.mixin(renderer.mixin)
// ... Or per module
export default {
  mixins: [ renderer.mixin ],
  // ...
}
```

## EXAMPLES
** same `options` object as above **

## WITHOUT SSR
**main.js**
```javascript
import Vue from 'vue'
import { Renderer } from 'fela-vue'

Vue.mixin( (new Renderer(options)).mixin )
```

## WITH SSR
**`entry.server.js` is the same as `entry.client.js`**
```javascript
import Vue from 'vue'
import { Renderer } from 'fela-vue'
// OR const { Renderer } = require('fela-vue')

const renderer = new Renderer({
  ...options,
  // SSR status to `true`.
  ssr: true
})

Vue.mixin(renderer.mixin)
```
**Then just put `renderer.style` into your template.**


## Component example
**MyComponent.vue**
```vue
<template>
  <div :class="f('wrapper')">
    <span :class="f('one')"> It's green! </span>
    <span :class="f('two')"> It's cyan! </span>
    <span :class="f('three', {color: 'white'})"> you don't see me! </span>
    <span :class="f({color: 'yellow'})"> I do it by myself! </span>
    <span :class="f('one two, bold')"> Combined classes by commas and spaces </span>
    <span :class="f('bold my-kebab')"> And kebab-case! </span>
    <span :class="f('bold myKebab')"> The same! </span>
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
      // Or any other key in `options.defStyles.key`.
      const { colors } = this.fdef

      return {
        one: {
          color: 'green'
        },
        two: {
          color: colors.cyan
        },
        three: ({color}) => {
          fontWeight: 'bold',
          color
        },
        bold: () => ({
          fontWeight: 'bold'
        }),
        // 'my-kebab' is also valid if the same in the template.
        myKebab: {
          color: 'purple'
        }
      }
    }
  }
}
</script>
```

It's better to make this computed in the end of a component definition or make a const variable at the bottom and return it from the computed prop.

Also, It's very handy to make snippets for adding style() {} to computed.
