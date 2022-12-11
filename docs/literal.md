
# Literal css.

It is a relatively simple helper that makes a fela-friendly object
of your css-like sheet.
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

Both `/* multi-line comments */` end `// one-line` are supported:

```javascript
import { css } from 'fela-vue'
const shouldMargin = false
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