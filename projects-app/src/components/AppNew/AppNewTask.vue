<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Create new task</SheetTitle>
      </SheetHeader>
      <FormKit
        type="form"
        @submit="createTask"
        submit-label="Create Task"
        :config="{ validationVisibility: 'submit' }"
      >
        <FormKit
          type="text"
          name="name"
          id="name"
          label="Name"
          placeholder="My new task"
          validation="required|length:1,255"
        />
        <FormKit
          type="select"
          name="project_id"
          id="project_id"
          label="Project"
          placeholder="Select a project"
          :options="selectOptions.projects"
          validation="required"
        />
        <FormKit
          type="select"
          name="assigned_to"
          id="assigned_to"
          label="User"
          placeholder="Select a user"
          :options="selectOptions.users"
          validation="required"
        />
        <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Description"
          placeholder="Task description"
          validation="length:0,500"
        />
        <FormKit
          type="select"
          name="status_id"
          id="status_id"
          label="Status"
          placeholder="Select a status"
          :options="selectOptions.statuses"
          validation="required"
        />
      </FormKit>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import type { CreateNewTask } from '@/types/CreateNewForm'
import {
  projectsQuery,
  usersQuery,
  createNewTaskQuery,
  taskStatusesQuery
} from '@/utils/supaQueries'

const sheetOpen = defineModel<boolean>()

type SelectOption = { label: string; value: number | string }

const selectOptions = ref({
  projects: [] as SelectOption[],
  users: [] as SelectOption[],
  statuses: [] as SelectOption[]
})

const getProjectsOptions = async () => {
  const { data: allProjects } = await projectsQuery

  if (!allProjects) return

  allProjects.forEach((project) => {
    selectOptions.value.projects.push({ label: project.name, value: project.id })
  })
}

const getUsersOptions = async () => {
  const { data: allUsers } = await usersQuery

  if (!allUsers) return

  allUsers.forEach((user) => {
    selectOptions.value.users.push({ label: user.full_name, value: user.id })
  })
}
const getStatusOptions = async () => {
  // Clear existing options first
  selectOptions.value.statuses = []

  const { data: allStatuses, error } = await taskStatusesQuery()

  if (error || !allStatuses) {
    console.error('Failed to fetch statuses:', error)
    return
  }

  console.log('Raw status data:', allStatuses)

  // Use a Set to track unique names (case insensitive)
  const uniqueStatuses = new Map()

  allStatuses.forEach((status) => {
    // Only add each status name once
    const statusName = status.name.toLowerCase()
    if (!uniqueStatuses.has(statusName)) {
      uniqueStatuses.set(statusName, {
        label: status.name,
        value: status.id,
        color: status.color
      })
    } else {
      console.log(`Duplicate status found: ${status.name} (ID: ${status.id})`)
    }
  })

  selectOptions.value.statuses = Array.from(uniqueStatuses.values())
  console.log('Final statuses array:', selectOptions.value.statuses)
}

const getOptions = async () => {
  await Promise.all([getProjectsOptions(), getUsersOptions(), getStatusOptions()])
}

getOptions()

const { user } = storeToRefs(useAuthStore())
const router = useRouter()
/* TODO check for the id do the same for the project func - we need also the data aswell the error */
const createTask = async (formData: CreateNewTask) => {
  try {
    // Validate required fields
    if (!formData.name || !formData.project_id || !formData.assigned_to) {
      console.error('Required fields are missing:', {
        name: !!formData.name,
        project_id: !!formData.project_id,
        profile_id: !!formData.id
      })
      return
    }

    const task = {
      ...formData,
      owner_id: user.value?.id || null,
      tags: [],
      collaborators: user.value?.id ? [user.value.id] : [],
      status_id: formData.status_id
    }
    /* TODO add data */
    const { error, data }: { error: any; data: { id: number } | { id: number }[] | null } =
      await createNewTaskQuery(task)

    if (error) {
      console.error('Task creation failed:', error)
      return
    }
    console.log('Task created successfully:')

    // Reset form and close sheet on success
    sheetOpen.value = false
    /* TODO navigate to the new task*/
    if (data) {
      router.push(`/tasks/${Array.isArray(data) ? data[0]?.id : data?.id}`)
    }

    /*  selectOptions.value = {
      projects: [],
      users: [],
      statuses: []
    } */
  } catch (err) {
    console.error('Error creating task:', err)
  }
}
</script>
