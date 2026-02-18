<template>
  <div class="parent">
    <div class="child-1">Child 1</div>
    <div class="child-2">Child 2</div>
    <div class="child-3">Child 3</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { css } from '../../../src/css-lit';
import { styl } from '../styles';

const style = computed(() => styl(css`
  .parent {
    padding: 1rem;
  }
  .child-1, .child-2, .child-3 {
    margin: 0.5rem;
  }
`))
</script>
