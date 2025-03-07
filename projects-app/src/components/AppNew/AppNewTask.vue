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
      </FormKit>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import type { CreateNewTask } from '@/types/CreateNewForm'
import { projectsQuery, usersQuery, createNewTaskQuery } from '@/utils/supaQueries'

const sheetOpen = defineModel<boolean>()

type SelectOption = { label: string; value: number | string }

const selectOptions = ref({
  projects: [] as SelectOption[],
  users: [] as SelectOption[]
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

const getOptions = async () => {
  await Promise.all([getProjectsOptions(), getUsersOptions()])
}

getOptions()

const { user } = storeToRefs(useAuthStore())

// In the same file, update the createTask function
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
      collaborators: user.value?.id ? [user.value.id] : []
    }

    const { error } = await createNewTaskQuery(task)

    if (error) {
      console.error('Task creation failed:', error)
      return
    }

    // Reset form and close sheet on success
    sheetOpen.value = false
    selectOptions.value = {
      projects: [],
      users: []
    }
  } catch (err) {
    console.error('Error creating task:', err)
  }
}
</script>
