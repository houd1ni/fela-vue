
# Composition API example.

```javascript
// styles.js
// Here is a good place for default styles
// and even the whole options object for the renderer.

// Not required tho.
const options = {
  defStyles() {
    return css`.center {display flex; justify-content: center}`
  }
}

const renderer = new Renderer({ ...options })

// Nothing common with stylus:
// .style was already there for SSR proposes and this is shorter.
export const styl = renderer.styl
```

```javascript
// main.js
// Nothing special here:
// with Composition API we are free of side-effects c:
```

```vue
<template>
  <div :class="f('center root')">
    lalala
  </div>
</template>

<script setup>
import { styl } from './styles'
import { computed } from 'vue'

// As in Options API, I recommend to use a User Snippet for this.
const f = computed(() => styl(css`
  .root {
    color cyan;
    text-decoration underline;
    cursor pointer;
  }
`))
</script>
```