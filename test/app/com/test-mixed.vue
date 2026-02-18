<template>
  <div class="mixed-button">Mixed Component</div>
  <div class="static-class">Static class</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { css } from '../../../src/css-lit';
import { styl } from '../styles';

const style = computed(() => styl(css`
  .mixed-button {
    background: green;
  }
`))

// Some other variable
const staticClass = 'static-class'
</script>
