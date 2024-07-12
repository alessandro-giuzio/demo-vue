<template>
  <div :class="`p-6 ${bg} rounded-lg shadow-md`">
    <slot> </slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  bg: {
    type: String,
    default: 'bg-gray-100',
  },
});
</script>
