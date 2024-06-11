<template>
  <div @click="selectPlan" class="plan" :class="{ 'active-plan': selected }">
    <div class="description">
      <span class="title"> {{ name }}</span>
    </div>
  </div>
</template>

<script setup>
// imports

// props
const props = defineProps({
  name: { type: String, default: 'Deafult Plan' },
  selected: { type: Boolean, default: false }
})
const emit = defineEmits(['selected'])

function selectPlan() {
  emit('selected', props.name)
}
</script>
