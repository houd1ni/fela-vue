<template>
  <div :class="dynamicClass">Dynamic Class</div>
  <div class="staticClass">Static Class</div>
  <div :class="[dynamicClass, 'staticClass']">Array Class</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { css } from '../../../src/css-lit';
import { styl } from '../styles';

const style = computed(() => styl(css`
  .staticClass {
    font-weight: bold;
  }
`))

const dynamicClass = 'dynamic-class'
</script>
