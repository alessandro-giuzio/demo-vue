<template>
  <div class="relative w-full max-w-xs">
    <select
      v-model="selectedId"
      @change="handleChange"
      :disabled="readonly"
      class="w-full px-4 py-2 text-sm font-medium transition-all bg-white border rounded-md appearance-none cursor-pointer dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:shadow-sm disabled:opacity-50"
    >
      <option
        v-for="status in sortedStatuses"
        :key="status.id"
        :value="status.id"
        :style="{ backgroundColor: status.color || '#ccc', color: getTextColor(status.color) }"
        class="py-2"
      >
        {{ status.name }}
      </option>
    </select>
    <iconify-icon
      icon="lucide:chevron-down"
      class="absolute text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { TaskStatus } from '@/types/TaskStatus'
import type { CreateNewTask } from '@/types/CreateNewForm'
import { taskStatusesQuery } from '@/utils/supaQueries'

interface StatusProps {
  modelValue: CreateNewTask['status_id']
  readonly?: boolean
}

const props = defineProps<StatusProps>()
const emit = defineEmits(['update:modelValue', 'commit'])

const statuses = ref<TaskStatus[]>([])

// Sorted statuses by order_index
const sortedStatuses = computed(() =>
  [...statuses.value].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
)

// Internal state bound to <select>
const selectedId = ref(props.modelValue)

// Watch for external modelValue updates
watch(
  () => props.modelValue,
  (newVal) => {
    selectedId.value = newVal
  }
)

// Handle <select> change
const handleChange = () => {
  emit('update:modelValue', selectedId.value)
  emit('commit', { status_id: selectedId.value })
}

// Fetch statuses
onMounted(async () => {
  const { data } = await taskStatusesQuery()
  if (data) {
    statuses.value = data.map((status) => ({
      id: status.id,
      name: status.name,
      color: status.color || '#ccc',
      order_index: status.order_index ?? undefined
    }))

    // If no current value, default to first
    if (!props.modelValue && statuses.value.length > 0) {
      const first = statuses.value[0]
      emit('update:modelValue', first.id)
      emit('commit', { status_id: first.id })
      selectedId.value = first.id
    }
  }
})
const getTextColor = (bgColor?: string) => {
  if (!bgColor) return '#000'
  // Simple luminance check to ensure contrast
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 186 ? '#000' : '#fff'
}
</script>
