<template>
  <DataTable v-if="tasks" :columns="columns" :data="tasks" />
</template>

<script setup lang="ts">
import { tasksWithProjectsQuery } from '@/utils/supaQueries'
import type { TasksWithProjects } from '@/utils/supaQueries'
import { columns } from '@/utils/tableColumns/taskColumns'

usePageStore().pageData.title = 'Tasks'

const tasks = ref<TasksWithProjects | null>(null)
const getTasks = async () => {
  const { data, error } = await tasksWithProjectsQuery
  if (error) console.error(error)

  tasks.value = data
}

await getTasks()
</script>
