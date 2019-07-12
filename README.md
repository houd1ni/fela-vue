# fela-vue
Fela mixin for Vue designed for flexibility yet team-oriented. [website.](https://houd1ni.github.io/fela-vue/)

[![Build Status](https://circleci.com/gh/houd1ni/fela-vue/tree/master.svg?style=shield)](https://circleci.com/gh/houd1ni/fela-vue/tree/master) [![codecov](https://codecov.io/gh/houd1ni/fela-vue/branch/master/graph/badge.svg)](https://codecov.io/gh/houd1ni/fela-vue) [![bundlephobia](https://badgen.net/bundlephobia/minzip/fela-vue)](https://bundlephobia.com/result?p=fela-vue)  [![npm](https://badgen.net/npm/v/fela-vue)](https://www.npmjs.com/package/fela-vue) [![Deps](https://david-dm.org/houd1ni/fela-vue.svg)](https://david-dm.org/houd1ni/fela-vue) [![DevDeps](https://david-dm.org/houd1ni/fela-vue/dev-status.svg)](https://david-dm.org/houd1ni/fela-vue)
(tree-shaking friendly!)

**[Fela](https://github.com/rofrischmann/fela) does the great job, but it has no idea how to cook it with Vue.
This is what I've created after combining vue's :style and :class attributes to make apps dynamically configured and easiest to write and maintain.**

Included as deps:
- [fela](https://github.com/rofrischmann/fela)
- [fela-dom](https://github.com/rofrischmann/fela/tree/master/packages/fela-dom)
- [fela-plugin-embedded](https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-embedded)
- [fela-plugin-prefixer](https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-prefixer)
- [fela-plugin-fallback-value](https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-fallback-value)
- [fela-plugin-unit](https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-unit)

*The plugins are a lite most useful part of [fela-preset-web](https://github.com/rofrischmann/fela/tree/master/packages/fela-preset-web).*


## USAGE

[More about plugins.](https://fela.js.org/docs/advanced/Plugins.html) Several basic are already built in here!

[More about enhancers.](https://fela.js.org/docs/advanced/Enhancers.html)
[I suggest to look at this one first.](https://github.com/rofrischmann/fela/tree/master/packages/fela-monolithic)

*In the options object below you can also add [other Renderer options](https://fela.js.org/docs/advanced/RendererConfiguration.html)*

```javascript
// All of the options are optional.
const options = {
  // Default styles to mix. Does not mix if omitted.
  // Have a look at the example below to see it in action.
  // Either pass a function (then key would be `fdef`):
  defStyles: (componentInstance) => ({ colors: { cyan: 'cyan' } }),
  // ... Or an object with your own key:
  defStyles: {
    key: 'fdef',
    value: (componentInstance) => ({ colors: { cyan: 'cyan' } })
  },
  // Name of styling method. Defaults to `f`.
  method: 'f',
  // Additional fela plugins.
  plugins: [],
  // Additional fela enhancers.
  enhancers: [],
  // Preset configurations.
  preset: {
    // Config for fela-plugin-unit. Same defaults ('px', {}).
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
    <span :class="f('button one')">
      If class is not in local style(), it will be taken from defaults (defStyles), if present.
      Here's button could be taken from there, then merged with `one`
      where is `one` is in priority: right to left principle.
    </span>
    <div v-for="i in [0,1,2]">
      <span
        :class="f((i) => ({color: ['green', 'blue', 'yellow'][i]}))"
      > This way is OK too. </span>
    </div>
  </div>
</template>

<script>
// Uncomment to use literal css: css`...`
// import { css } from 'fela-vue'

export default {
  computed: {
    style() {
      // Or any other key in `options.defStyles.key`.
      const { colors } = this.fdef

      // Also, it's OK to return one css`...` with all classes included.
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
        },
        anotherClass: css`
          background: grey
        `,
        ...css`
          .other-class {
            margin-top: 44; // still ok for fela. will be 44px.
            // you can comment a whole line,
            // and if you want to make comment at end of a line,
            // please add a semicolon ; "moving" the comment to next line.
            margin-left: 22  // hence, this rule value will include this comment.
            /* block comments are also supported. */
            :hover {
              // no colons and semicolons are ok without comments.
              background grey
            }
          }
          .anotherOne {
            padding: 15
          }
        `
      }
    }
  }
}
</script>
```

It's better to make this computed in the end of a component definition or make a const variable at the bottom and return it from the computed prop.

Also, It's very handy to make snippets for adding style() {} to computed.
