<template>
  <!-- TODO complete the form to add new projects -->
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Create new project</SheetTitle>
      </SheetHeader>
      <FormKit
        type="form"
        @submit="createProject"
        submit-label="Create Project"
        :config="{ validationVisibility: 'submit' }"
      >
        <FormKit
          type="text"
          name="name"
          id="name"
          label="Name"
          placeholder="My new project"
          validation="required|length:1,255"
        />
        <!-- <FormKit
          type="select"
          name="assigned_to"
          id="assigned_to"
          label="User"
          placeholder="Select a user"
          :options="selectOptions.users"
          validation="required"
        /> -->
        <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Description"
          placeholder="Project description"
          validation="length:0,500"
        />
      </FormKit>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { getProjectBySlug } from '@/lib/supabaseClient'
import type { CreateNewProject } from '@/types/CreateNewForm'
import { usersQuery, createNewProjectQuery, assignUserToProjectQuery } from '@/utils/supaQueries'

const sheetOpen = defineModel<boolean>()

type SelectOption = { label: string; value: number | string }
const selectOptions = ref({
  users: [] as SelectOption[]
})

const getUsersOptions = async () => {
  const { data: allUsers } = await usersQuery.select('*')
  if (!allUsers) return
  allUsers.forEach((user) => {
    selectOptions.value.users.push({
      label: user.full_name || user.username,
      value: user.id
    })
  })
}
getUsersOptions()

// Get current logged-in user id from auth store
const { user } = storeToRefs(useAuthStore())

// Function invoked on form submission
const createProject = async (formData: CreateNewProject) => {
  if (!formData.name || !user.value?.id) {
    console.error('Missing data')
    return
  }

  const slug = formData.name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')

  // ✅ Check for existing project
  const { data: existingProject } = await getProjectBySlug(slug)
  if (existingProject) {
    console.error('A project with this slug already exists.')
    return
  }

  const projectPayload = {
    name: formData.name,
    description: formData.description || '',
    slug,
    status: 'in-progress',
    owner_id: user.value.id,
    collaborators: [user.value.id]
  }

  const { data: newProject, error: projectError } = await createNewProjectQuery(projectPayload)

  if (projectError || !newProject) {
    console.error('Project creation failed:', projectError)
    return
  }

  const { error: linkError } = await assignUserToProjectQuery({
    userId: user.value.id,
    projectId: newProject.id,
    role: 'owner',
    status: 'in-progress'
  })

  if (linkError) {
    console.error('Failed to link user to project:', linkError)
    return
  }

  console.log('Project and user_project link created successfully:', newProject)
  sheetOpen.value = false
}

// Generate a slug from the name (using slugify)
/*   const slug = formData.name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '') */

// Build the payload for inserting a new project
/*   const projectPayload = {
    name: formData.name,
    description: formData.description || '',
    slug,
    status: 'in-progress',
    owner_id: user.value?.id,
    collaborators: user.value?.id ? [user.value.id] : []
  } */

/*   const { data, error } = await createNewProjectQuery(projectPayload)
  if (error) {
    console.error('Project creation failed:', error)
    return
  }
  console.log('Project created successfully:', data)
  // Optionally reset the form and close the modal
  sheetOpen.value = false
} */
</script>
