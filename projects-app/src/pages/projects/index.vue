<template>
  <DataTable v-if="projects" :columns="columns" :data="projects" />
  {{ projects.map((project) => project.collaborators) }}
</template>

<script setup lang="ts">
import { useCollabs } from '@/composables/collabs'
import { useProjectsStore } from '@/stores/loaders/projects'
import { columns } from '@/utils/tableColumns/projectsColumns'

usePageStore().pageData.title = 'Projects Page'

const projectsLoader = useProjectsStore()
const { projects } = storeToRefs(projectsLoader)
const { getProjects } = projectsLoader

await getProjects()
const { getGroupedCollabs, groupedCollabs } = useCollabs()

await getGroupedCollabs(projects.value)
console.log('TEST', groupedCollabs.value)
/* getGroupedCollabs(projects.value) */
</script>
