import type { ColumnDef } from "@tanstack/vue-table"
import type { Projects } from "../supaQueries"
import { RouterLink } from "vue-router"

export const columns: ColumnDef<Projects[0]>[] = [
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
    accessorKey: 'collaborators',
    header: () => h('div', { class: 'text-left' }, 'Collaborators'),
    cell: ({ row }) => {
      const collaborators = row.getValue('collaborators') as string[];
      return h('div', { class: 'text-left font-medium' }, collaborators.join(', '))
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
