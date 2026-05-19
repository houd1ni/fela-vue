<template>
  <div class="flex container column">
    <div v-if="true" :class="f('label')"><CalendarIcon :class="f('calendar-icon')" /> qwe {{ label }}</div>
     <form v-else :class="f('flex center full-width form')" action="/" method="post" @submit.prevent="true">
        <div :class="f('inputs')">
      </div>
    </form>
  </div>
</template>

<script setup lang="tsx">
import { css, Renderer } from 'fela-vue'
import { computed, ref } from 'vue'


const label = ref('aaaaa')
const renderer = new Renderer()
const styl = renderer.styl
computed(() => styl(css`
  /* Base Styles */
  .container {
    max-width 70
    margin 0 auto
    padding 2
  }
  /* Typography */
  .title {
    margin-bottom 0.5
    font-size 2
    font-weight 600
  }
`))
const f = (s: string) => s
</script>