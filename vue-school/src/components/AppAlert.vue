<template>
  <div v-if="!closed" role="alert" :class="`alert alert-${type}`">
    <component :is="icon"></component>
    <span><slot /></span>
    <button @click="close">🅧</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import IconError from '@/components/icons/IconError .vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import IconSuccess from '@/components/icons/IconSuccess.vue'
import IconWarning from '@/components/icons/IconWarning.vue'

const emit = defineEmits(['closed'])

const props = defineProps({
  type: {
    type: String,
    default: 'info'
  }
})

const alertType = computed(() => {
  return {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error'
  }[props.type]
})

const icon = computed(() => {
  return {
    info: IconInfo,
    success: IconSuccess,
    warning: IconWarning,
    error: IconError
  }[props.type]
})

const closed = ref(false)

function close() {
  closed.value = true
  emit('closed')
}
</script>
