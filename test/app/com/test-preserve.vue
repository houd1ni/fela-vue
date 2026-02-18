<template>
  <div :class="existingDirective">Existing Directive</div>
  <div class="shouldBeTransformed">Should be transformed</div>
  <div :class="anotherDirective" class="alsoTransform">Both</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { css } from '../../../src/css-lit';
import { styl } from '../styles';

const style = computed(() => styl(css`
  .shouldBeTransformed {
    color: blue;
  }
  .alsoTransform {
    color: red;
  }
`))

const existingDirective = 'static-class'
const anotherDirective = 'dynamic-class'
</script>
