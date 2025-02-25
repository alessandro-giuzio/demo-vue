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
      </FormKit>
      <FormKit
        type="select"
        name="profile_id"
        id="profile_id"
        label="User"
        placeholder="Select a user"
        :options="selectOptions.users"
        validation="required"
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
        type="textarea"
        name="description"
        id="description"
        label="Description"
        placeholder="Task description"
        validation="length:0,500"
      />
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

const createTask = async (formData: CreateNewTask) => {
  console.log('Form Data:', formData) // Debugging step
  if (!formData.project_id) {
    console.error('Error: project_id is missing!')
    return
  }
  const task = {
    ...formData,
    collaborators: [user.value!.id]
  }
  console.log('Final Task Object:', task)
  const { error } = await createNewTaskQuery(task)

  if (error) {
    // Log only when an error exists
    console.error('Task creation failed:', error)
    return
  }

  sheetOpen.value = false
}
</script>
