<template>
  <DataTable v-if="projects" :columns="columnsWithCollabs" :data="projects" />
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

getGroupedCollabs(projects.value ?? [])
console.log('TEST::' + JSON.stringify(groupedCollabs.value))

const columnsWithCollabs = columns(groupedCollabs)
</script>
