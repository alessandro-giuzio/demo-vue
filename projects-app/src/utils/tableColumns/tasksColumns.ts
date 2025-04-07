import type { ColumnDef } from "@tanstack/vue-table"
import type { TasksWithProjects } from "../supaQueries"
import { RouterLink } from "vue-router"
import AppInPlaceEditStatus from "@/components/AppInPlaceEdit/AppInPlaceEditStatus.vue"

export const columns: ColumnDef<TasksWithProjects[number]>[] = [
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
      return row.original.projects
        ? h(
            RouterLink,
            {
              to: `/projects/${row.original.projects.slug}`,
              class: 'text-left font-medium hover:bg-muted block w-full block w-full'
            },
            () => row.original.projects.name
          )
        : ''
    }
  },
 /*  {
    accessorKey: 'assigned_to',
    header: () => h('div', { class: 'text-left' }, 'Assigned To'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, row.getValue('assigned_to'))
    }
  }, */
  {
    accessorKey: 'assigned_user.full_name',
    header: () => h('div', { class: 'text-left' }, 'Assigned To'),
    cell: ({ row }) => {
      const fullName = (row.original as {
        assigned_user?: { full_name?: string }
      })?.assigned_user?.full_name || 'Unknown'

      return h('div', { class: 'text-left font-medium' }, fullName)
    },
  },
{
    accessorKey: 'status',
    header: () => h('div', { class: 'text-left' }, 'Status'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' },
        h(AppInPlaceEditStatus, { modelValue: row.original.status as "in-progress" | "completed" | undefined }),
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
    accessorKey: 'tags',
    header: () => h('div', { class: 'text-left' }, 'Tags'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, JSON.stringify(row.getValue('tags')))
    }
  }
]
