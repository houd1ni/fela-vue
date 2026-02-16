<template>
<div :class="style('button')">
    qwe !
   <div class="pew meow">label!</div>
</div>
...
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { css } from '../../src/css-lit';
import { styl } from './styles';

const style = computed(() => styl(css`
  .button {
    border 1px solid grey
  }
  .meow {
    margin-top 1rem
    color pink
  }
`))
</script>