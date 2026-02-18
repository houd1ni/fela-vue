<template>
  <div class="fela-button">Fela-Vue Component</div>
  <div class="fela-text">This should be transformed</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { css } from '../../../src/css-lit';
import { styl } from '../styles';

const style = computed(() => styl(css`
  .fela-button {
    background: blue;
  }
  .fela-text {
    color: white;
  }
`))
</script>
