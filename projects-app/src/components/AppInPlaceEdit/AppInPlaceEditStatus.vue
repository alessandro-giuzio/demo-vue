<template>
  <div class="flex p-2 mx-auto text-2xl cursor-pointer enter" @click="toggleValue">
    <Transition name="scale" mode="out-in">
      <iconify-icon
        v-if="localValue === 'completed'"
        icon="lucide:circle-check"
        class="text-green-500"
      />
      <iconify-icon v-else icon="lucide:circle-dot" class="text-gray-500" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PropType } from 'vue'

// Define props with an explicit v-model (modelValue) and default:
const props = defineProps({
  modelValue: {
    type: String as PropType<'in-progress' | 'completed'>,
    default: 'in-progress'
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

// Define emits for v-model update and custom commit
const emit = defineEmits(['update:modelValue', 'commit'])

// Create a local ref which syncs with props.modelValue
const localValue = ref(props.modelValue)

// Watch for any changes from the parent
watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal
  }
)

const toggleValue = () => {
  if (props.readonly) return

  // Toggle the value between 'completed' and 'in-progress'
  localValue.value = localValue.value === 'completed' ? 'in-progress' : 'completed'

  // Emit update so the parent's v-model is updated
  emit('update:modelValue', localValue.value)
  // Also emit a commit event with the new value
  emit('commit', localValue.value)
}
</script>
