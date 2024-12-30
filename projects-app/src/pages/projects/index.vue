<template>
  <DataTable v-if="projects" :columns="columns" :data="projects" />
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { RouterLink } from 'vue-router'
import type { Tables } from '../../../database/types'
import type { ColumnDef } from '@tanstack/vue-table'

usePageStore().pageData.title = 'Projects Page'

const projects = ref<Tables<'projects'>[] | null>(null)
;(async () => {
  const { data, error } = await supabase.from('projects').select('*')
  if (error) console.log(error)
  projects.value = data
  console.log('projects:', projects.value)
})()

const columns: ColumnDef<Tables<'projects'>>[] = [
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-left' }, 'Name'),
    cell: ({ row }) => {
      return h(
        RouterLink,
        {
          to: `/projects/${row.original.slug}`,
          class: 'text-left font-medium hover:bg-muted block w-full block w-full'
        },
        () => row.getValue('name')
      )
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
    accessorKey: 'owner_id',
    header: () => h('div', { class: 'text-left' }, 'Owner'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, row.getValue('owner_id'))
    }
  },
  {
    accessorKey: 'slug',
    header: () => h('div', { class: 'text-left' }, 'Slug'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, row.getValue('slug'))
    }
  }
]
</script>
