<template>
  <DataTable v-if="projects" :columns="columns" :data="projects" />
</template>

<script setup lang="ts">
import { columns } from '@/utils/tableColumns/projectsColumns'

usePageStore().pageData.title = 'Projects'

const projectLoader = useProjectsStore()
const { projects } = storeToRefs(projectLoader)
const { getProjects } = projectLoader

await getProjects()

const { getProfilesById } = useCollabs()
const test = await getProfilesById(projects.value[0].collaborators)
console.log('TEST ::', test)
/* getGroupedCollabs(projects.value) */
</script>
