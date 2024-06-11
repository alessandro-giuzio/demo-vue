<template>
  <button @mouseenter="hover = true" @mouseleave="hover = false" class="btn">
    <slot name="icon">🚀</slot>
    <slot>click me</slot>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const hover = ref(false)
</script>
