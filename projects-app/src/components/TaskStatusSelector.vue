<template>
  <div class="relative w-full max-w-xs">
    <select
      v-model="selectedId"
      @change="handleChange"
      :disabled="readonly"
      class="w-full py-2 pr-4 text-sm font-medium transition-all bg-white border rounded-md appearance-none cursor-pointer pl-9 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:shadow-sm disabled:opacity-50"
    >
      <option
        v-for="status in sortedStatuses"
        :key="status.id"
        :value="status.id"
        :style="{ backgroundColor: status.color || '#ccc' }"
        :class="[isDark(status.color) ? 'text-white' : 'text-black']"
        class="py-2"
      >
        {{ status.name }}
      </option>
    </select>

    <!-- Status dot - positioned absolutely to appear inside the select -->
    <span
      class="absolute inline-block w-3 h-3 -translate-y-1/2 rounded-full left-3 top-1/2"
      :style="{ backgroundColor: currentStatus?.color || '#ccc' }"
    ></span>

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
const hasLoaded = ref(false)

// Sorted statuses by order_index
const sortedStatuses = computed(() =>
  [...statuses.value].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
)

// Find the current status object based on the id
const currentStatus = computed(() =>
  statuses.value.find((status) => status.id === selectedId.value)
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

// Function to determine if background color is dark
const isDark = (bgColor?: string) => {
  if (!bgColor) return false
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance <= 186
}

// Fetch statuses
onMounted(async () => {
  if (hasLoaded.value) return
  console.log('Fetching statuses - initial state:', { hasLoaded: hasLoaded.value })
  const { data } = await taskStatusesQuery()
  if (data) {
    // Ensure unique statuses by ID
    const uniqueStatuses = new Map()
    data.forEach((status) => {
      if (!uniqueStatuses.has(status.id)) {
        uniqueStatuses.set(status.id, {
          id: status.id,
          name: status.name,
          color: status.color || '#ccc',
          order_index: status.order_index ?? undefined
        })
      }
    })
    console.log('After deduplication:', uniqueStatuses.size, 'unique items')
    statuses.value = Array.from(uniqueStatuses.values())

    // If no current value, default to first
    if (!props.modelValue && statuses.value.length > 0) {
      const first = statuses.value[0]
      selectedId.value = first.id
      emit('update:modelValue', first.id)
      emit('commit', { status_id: first.id })
    }

    hasLoaded.value = true
    console.log('Component loaded, hasLoaded set to:', hasLoaded.value)
  }
})
</script>

<style>
/* This helps ensure the colored dot display works correctly with select options */
select option {
  padding-left: 25px;
  position: relative;
}
</style>
