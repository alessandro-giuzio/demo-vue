<template>
  <div class="modal-dark" v-if="modelValue">
    <h1>{{ title }}</h1>
    <slot />
    <button @click="$emit('update:modelValue')">Hiding Modal</button>
  </div>
</template>
<style scoped>
.modal-dark {
  background-color: #333;
  color: white;
  padding: 10px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
<script setup>
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
/* const handleButtonClick = () => {
  emit('update:modelValue', false)
} */
</script>
