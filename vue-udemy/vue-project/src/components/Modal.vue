<template>
  <div class="modal" v-if="modelValue">
    <h1>{{ title }}</h1>
    <slot />
    <button @click="$emit('update:modelValue')">Hiding Modal</button>
    <div>Username is: {{ userData.username }}</div>
  </div>
</template>
<style scoped>
.modal {
  background-color: bisque;
  padding: 10px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
<script setup>
import { inject } from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },

  title: {
    type: String,
    default: 'Default Title'
  }
})

/* handleButtonClick */

/* emits */
const emit = defineEmits(['update:modelValue'])
const handleButtonClick = () => {
  emit('update:modelValue', false)
}

/* userData */
const userData = inject('userData')
</script>
