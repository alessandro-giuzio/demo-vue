<template>
  <DataTable v-if="projects" :columns="columnsWithCollabs" :data="filteredProjects" />
</template>

<script setup lang="ts">
import { useCollabs } from '@/composables/collabs'
import { useProjectsStore } from '@/stores/loaders/projects'
import { columns } from '@/utils/tableColumns/projectsColumns'

usePageStore().pageData.title = 'My Projects'

const projectsLoader = useProjectsStore()
const { projects } = storeToRefs(projectsLoader)
const { userReg } = storeToRefs(useAuthStore())
const { getProjects } = projectsLoader

await getProjects()
const { getGroupedCollabs, groupedCollabs } = useCollabs()
// Filter projects for the logged-in user
const filteredProjects = computed(() => {
  if (!projects.value) return []

  return projects.value.filter((project) => project.owner_id === userReg.value?.id)
})
getGroupedCollabs(projects.value ?? [])
console.log('TEST::' + JSON.stringify(groupedCollabs.value))

const columnsWithCollabs = columns(groupedCollabs)
</script>
