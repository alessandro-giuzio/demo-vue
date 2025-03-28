import type { ColumnDef } from "@tanstack/vue-table"
import type { Projects, User } from "../supaQueries"
import { RouterLink } from "vue-router"
import type {Ref} from 'vue'
import type { GroupedCollabs } from "@/types/GroupedCollabs"
import Avatar from "@/components/ui/avatar/Avatar.vue"
import AvatarImage from "@/components/ui/avatar/AvatarImage.vue"
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AppInPlaceEditStatus from "@/components/AppInPlaceEdit/AppInPlaceEditStatus.vue"

export const columns = (collabs: Ref<GroupedCollabs>) : ColumnDef<Projects & { users?: User, id: string }>[] => [

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
      accessorKey: 'status',
      header: () => h('div', { class: 'text-left' }, 'Status'),
      cell: ({ row }) => {
        return h('div', { class: 'text-left font-medium' },
          h(AppInPlaceEditStatus, { modelValue: row.original.status as "in-progress" | "completed" | undefined, readonly: true }),
        )
      }
    },
  {
    accessorKey: 'owner_id',
    header: () => h('div', { class: 'text-left' }, 'Owner'),
    cell: ({ row }) => {
      const owner = row.original.users
      return h(
        'div',
        { class: 'flex items-center gap-2 whitespace-nowrap' }, // Align and prevent wrapping
        [
          h(Avatar, { class: 'w-8 h-8 rounded-full' }, () =>
            h(AvatarImage, { src: owner?.avatar_url || '', alt: owner?.full_name || 'Owner' }, () =>
              h(AvatarFallback, {}, owner?.full_name?.charAt(0) || '?')
            )
          ),
          h(
            RouterLink,
            {
              to: `/users/${owner?.username}`,
              class: 'text-left font-medium underline text-green-700'
            },
            () => owner?.full_name || 'Unknown'
          )
        ]
      )
    }
  },
  {
    accessorKey: 'collaborators',
    header: () => h('div', { class: 'text-left' }, 'Collaborators'),
    cell: ({ row }) => {
      console.log("Row ID:", row.original.id)
      console.log("Collaborators:", collabs.value[row.original.id]) // Debugging

      return h(
        'div',
        { class: 'text-left font-medium h-20 flex items-center' },
        (Array.isArray(collabs.value[row.original.id]) ? collabs.value[row.original.id] : []).map((collab) => {
          return h(
            RouterLink,
            { to: `/users/${collab.username}` },
            () => h(
              Avatar,
              { class: 'hover:scale-110 transition-transform' },
              () => h(AvatarImage, { src: collab.avatar_url || '' })
            )
          )
        }) || []  // Ensure it returns an empty array if undefined
      )
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
