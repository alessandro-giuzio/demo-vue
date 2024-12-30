<template>
  <DataTable v-if="tasks" :columns="columns" :data="tasks" />
</template>
<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import type { Tables } from '../../../database/types'
import type { ColumnDef } from '@tanstack/vue-table'
import { RouterLink } from 'vue-router'

usePageStore().pageData.title = 'Tasks Page'

const tasks = ref<Tables<'tasks'>[] | null>(null)
const getTasks = async () => {
  const { data, error } = await supabase.from('tasks').select(`
  *,
  projects (
  id,
  name,
  slug)
  `)

  if (error) console.log(error)

  tasks.value = data
}

await getTasks()

const columns: ColumnDef<Tables<'tasks'>>[] = [
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-left' }, 'Name'),
    cell: ({ row }) => {
      return h(
        RouterLink,
        {
          to: `/tasks/${row.original.id}`,
          class: 'text-left font-medium hover:bg-muted block w-full block w-full'
        },
        () => row.getValue('name')
      )
    }
  },
  {
    accessorKey: 'projects',
    header: () => h('div', { class: 'text-left' }, 'Project'),
    cell: ({ row }) => {
      return h(
        RouterLink,
        {
          to: `/projects/${row.original.projects.slug}`,
          class: 'text-left font-medium hover:bg-muted block w-full block w-full'
        },
        () => row.getValue('projects').name
      )
    }
  },
  {
    accessorKey: 'assigned_to',
    header: () => h('div', { class: 'text-left' }, 'Assigned To'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, row.getValue('assigned_to'))
    }
  },
  {
    accessorKey: 'status',
    header: () => h('div', { class: 'text-left' }, 'Status'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, row.getValue('status'))
    }
  },
  {
    accessorKey: 'description',
    header: () => h('div', { class: 'text-left' }, 'Description'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, row.getValue('description'))
    }
  },
  {
    accessorKey: 'tags',
    header: () => h('div', { class: 'text-left' }, 'Tags'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, JSON.stringify(row.getValue('tags')))
    }
  }
]
</script>
