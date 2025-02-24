<template>
  <DataTable
    v-if="filteredProjects.length"
    :columns="columnsWithCollabs"
    :data="filteredProjects"
  />
  <p v-else>No projects found for the logged-in user.</p>
</template>

<script setup lang="ts">
import { useCollabs } from '@/composables/collabs'
import { useProjectsStore } from '@/stores/loaders/projects'
import { filterProjectsForUser } from '@/utils/supaQueries'
import { columns } from '@/utils/tableColumns/projectsColumns'

// Set the page title
usePageStore().pageData.title = 'My Projects'

// Initialize the projects store
const projectsLoader = useProjectsStore()
const { projects } = storeToRefs(projectsLoader)
const { getProjects } = projectsLoader

// Get the logged-in user's registration details
const { userReg } = storeToRefs(useAuthStore())

// Fetch projects for the logged-in user
await getProjects()

// Filter projects for the logged-in user
const filteredProjects = userReg.value?.id ? await filterProjectsForUser(userReg.value.id) : []

// Initialize the collaborators composable
const { getGroupedCollabs, groupedCollabs } = useCollabs()

// Fetch and group collaborators for the projects
await getGroupedCollabs(filteredProjects)

// Log the grouped collaborators for debugging
console.log('TEST::' + JSON.stringify(groupedCollabs.value))

// Define the columns with collaborators
const columnsWithCollabs = columns(groupedCollabs)
</script>
