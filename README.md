# fela-vue
Fela mixin for Vue designed for flexibility yet team-oriented.

**Fela did the great job, but it has no idea how to cook it with Vue.
This is what I've created after combining vue's :style and :class attributes to make apps dynamically configured and easiest to write and maintain.**

Other information is coming soon: stay tuned! I'm grumming it for open-source now.

Usage:

**main.js**
```javascript
import felaVue from 'fela-vue'

Vue.mixin(felaVue({
  fdef: () => defaultStylesObject // not required. Default styles to mix.
  method: 'f' // not required. Name of styling method. Defaults to `f`.
}))
```

**MyComponent.vue**
```vue
<template>
  <div :class="f('wrapper')">
    <span :class="f('one')"> It's green! </span>
    <span :class="f('two')"> It's cyan! </span>
    <span :class="f('three', {color: 'white'})"> you don't see me!</span>
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
