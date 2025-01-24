<template>
  <DataTable v-if="tasks" :columns="columns" :data="filteredTasks" />
</template>
<script setup lang="ts">
import { tasksWithProjectsQuery } from '@/utils/supaQueries'
import { columns } from '@/utils/tableColumns/tasksColumns'
import type { TasksWithProjects } from '@/utils/supaQueries'

usePageStore().pageData.title = 'My Tasks'
const { userReg } = storeToRefs(useAuthStore())

const tasks = ref<TasksWithProjects | null>(null)
const getTasks = async () => {
  const { data, error, status } = await tasksWithProjectsQuery

  if (error) useErrorStore().setError({ error, customCode: status })

  tasks.value = data
}

await getTasks()
// Filter tasks for the logged-in user
const filteredTasks = computed(() => {
  if (!tasks.value || !userReg.value?.id) return []

  return tasks.value.filter((task) => task.assigned_to === userReg.value?.id)
})
</script>
