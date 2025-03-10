<template>
  <DataTable v-if="filteredTasks.length" :columns="columns" :data="filteredTasks" />
  <p v-else>No tasks found for the logged-in user.</p>
</template>

<script setup lang="ts">
import { tasksWithProjectsQuery, filterTasksForUser } from '@/utils/supaQueries'
import { columns } from '@/utils/tableColumns/tasksColumns'
import type { TasksWithProjects } from '@/utils/supaQueries'

// Set the page title
usePageStore().pageData.title = 'My Tasks'

// Set the meta title and description
useMeta({
  title: 'My Tasks',
  description: {
    name: 'description',
    content: 'View your tasks'
  }
})

// Get the logged-in user's registration details
const { userReg } = storeToRefs(useAuthStore())

// Define a ref to hold the tasks
const tasks = ref<TasksWithProjects | null>(null)

// Fetch tasks for the logged-in user
const getTasks = async () => {
  const { data, error, status } = await tasksWithProjectsQuery

  if (error) {
    useErrorStore().setError({ error, customCode: status })
    return
  }

  tasks.value = data
}

await getTasks()

// Filter tasks for the logged-in user
const filteredTasks = userReg.value?.id ? await filterTasksForUser(userReg.value.id) : []
</script>
