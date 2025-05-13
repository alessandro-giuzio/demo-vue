<template>
  <div class="relative">
    <!-- Display Current Status -->
    <div class="flex p-2 mx-auto cursor-pointer" @click="toggleValue">
      <div class="flex items-center gap-2">
        <span
          class="inline-block w-3 h-3 rounded-full"
          :style="{ backgroundColor: currentStatus?.color || '#ccc' }"
        ></span>
        <span>{{ currentStatus?.name || 'Loading...' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TaskStatus } from '@/types/TaskStatus'
import type { CreateNewTask } from '@/types/CreateNewForm'
import { taskStatusesQuery } from '@/utils/supaQueries'

// Define props using the CreateNewTask type for the status_id field
interface StatusProps {
  modelValue: CreateNewTask['status_id']
  readonly?: boolean
}

const props = defineProps<StatusProps>()
const emit = defineEmits(['update:modelValue', 'commit'])

// Track available statuses
const statuses = ref<TaskStatus[]>([])

// Find the current status object based on the id
const currentStatus = computed(() => {
  return statuses.value.find((status) => status.id === props.modelValue)
})

// Toggle to next status
const toggleValue = () => {
  if (props.readonly) return

  // Get all statuses sorted by order_index
  const sortedStatuses = [...statuses.value].sort(
    (a, b) => (a.order_index || 0) - (b.order_index || 0)
  )

  if (sortedStatuses.length < 2) return

  // Find current index
  const currentIndex = sortedStatuses.findIndex((s) => s.id === props.modelValue)

  // If current status not found, start with the first status
  if (currentIndex === -1 && sortedStatuses.length > 0) {
    const firstStatus = sortedStatuses[0]
    emit('update:modelValue', firstStatus.id)
    emit('commit', { status_id: firstStatus.id })
    return
  }

  // Get next status (or loop back to first)
  const nextIndex = (currentIndex + 1) % sortedStatuses.length
  const nextStatus = sortedStatuses[nextIndex]

  // Emit the ID of the next status
  emit('update:modelValue', nextStatus.id)
  emit('commit', { status_id: nextStatus.id })
}

// Fetch statuses on component mount
onMounted(async () => {
  const { data } = await taskStatusesQuery()
  if (data) {
    statuses.value = data.map((status) => ({
      id: status.id,
      name: status.name,
      color: status.color || '#ccc',
      order_index: status.order_index ?? undefined
    }))

    // If we have statuses but no current status, set a default
    if (!props.modelValue && statuses.value.length > 0) {
      emit('update:modelValue', statuses.value[0].id)
      emit('commit', { status_id: statuses.value[0].id })
    }
  }
})
</script>
