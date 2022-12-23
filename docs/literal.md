
# Literal css.

It is a relatively simple helper that makes a fela-friendly object
of your css-like sheet.

**First of all, starting from 2.8.2 if your build tool is rollup or Vite,
consider using compression to really heavingly compress strings in css`` literals.
They become much smaller than original fela objects and any css minifier's output.
It saves a lot of client's bandwith by cost of adding small boilerplate
(somewhere less than one kb not gzipped). All a bit costy computations
are done during compilation time.**

```javascript
// vite.config.mjs or similar option in rollup.config.mjs
import { defineConfig } from 'vite'
import { rollupCSSCompression } from 'fela-vue'

export default defineConfig({
  plugins: [
    // vue(),
    // ...
    rollupCSSCompression()
  ]
})
```

```javascript
// main.js of your project.
import { setCompression } from 'fela-vue'

// This hints the parser to use decompression methods.
setCompression(true)
```

It can be used like regular css or with (semi)colons omitted:

```javascript
import { css } from 'fela-vue'
css`
  .class-one {
    color: cyan;
    background: url("data:image/gif;base64,R0lGO");
  }
  .class-two {
    color blue
    background cyan
    :hover {
      text-decoration underline
    }
    >*:first-of-type {
      padding 66
    }
  }
`
```

For short rulesets without classes:

```javascript
css`
  color cyan
  border grey
  margin 3
` // returns { color: 'cyan', border: 'grey', margin: '3px' }
// 'px' are default units in fela unit plugin.
//      See correspondent options parameter.
```

Use `...spread` operator with classes to share rules.
Use when class names composition in f('class1 class2') decrease readability.

```javascript
import { css } from 'fela-vue'
css`
  .common1 {
    display flex
    color green
  }
  .common2 {
    position relative
  }
  .cls {
    ...common1
    ...common2
    color cyan // cyan is better.
    background magenta // wow.
  }
`
```

Both `/* multi-line comments */` end `// one-line` are supported:

```javascript
import { css } from 'fela-vue'
css`
  .cls {
    /* color red
      background red
    */
    color cyan // cyan is better.
    background magenta // wow.
  }
`
```

It omits `falsy` rules like `null` and `false` completely:

```javascript
import { css } from 'fela-vue'
const shouldMargin = false
css`
  .cls {
    color cyan
    margin ${shouldMargin && '20px'} // will be removed.
  }
` // returns { cls: {color: 'cyan'} }
```

There's functions that accepts both `this` from a Vue Component instance
and parameters given from a template:

```vue
<template>
  <div
    v-for="i in list"
    :class="f('class-two', {i})"
  />
</template>

<script>
// Options API for illustration proposes.
import { css } from 'fela-vue'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      selected: 2,
      list: [1, 2, 3, 4, 5]
    }
  },
  computed: {
    style() {
      return css`
        .class-one {
          color: white;
          background: cyan;
        }
        .class-two => { // no arguments here. just the arrow.
          color blue
          // All dynamic expressions should be put into []
          //     this been done for performance.
          // @ is a vue component instance shortcut.
          // $ is a argumant object shortcut. 
          background [$i==@selected ? 'cyan' : null]
        }
      `
    }
  }
})
</script>
```

## Ceveats.

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