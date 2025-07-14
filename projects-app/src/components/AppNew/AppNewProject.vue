<template>
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
        <!-- Only for project managers and admins -->
        <div v-if="authStore.isProjectManager">
          <FormKit
            type="select"
            name="assigned_to"
            id="assigned_to"
            label="Assigned to"
            placeholder="Select a user"
            :options="selectOptions.users"
            validation="length:0,255"
          />
        </div>
        <!-- <FormKit
          type="select"
          name="assigned_to"
          id="assigned_to"
          label="Assigned to"
          placeholder="Select a user"
          :options="selectOptions.users"
          validation="length:0,255"
        /> -->
        <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Description"
          placeholder="Project description"
          validation="length:0,500"
        />
        <FormKit
          type="select"
          name="collaborators"
          id="collaborators"
          label="Collaborators"
          placeholder="Select collaborators"
          :options="selectOptions.users"
          multiple
          validation="length:0,255"
        />
        <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Description"
          validation="length:0,500"
        />

        <!-- Admin-only options -->
        <div v-if="authStore.isAdmin" class="pt-4 mt-4 border-t">
          <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Admin Options</h3>
          <FormKit type="checkbox" name="featured" label="Featured Project" />
          <FormKit
            type="select"
            name="priority"
            label="Priority"
            :options="[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' }
            ]"
          />
        </div>
      </FormKit>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getProjectBySlug } from '@/lib/supabaseClient'
import type { CreateNewProject } from '@/types/CreateNewForm'
import { usersQuery, createNewProjectQuery, assignUserToProjectQuery } from '@/utils/supaQueries'

const router = useRouter()
const sheetOpen = defineModel<boolean>()
const authStore = useAuthStore()
// Ensure roles are loaded
onMounted(async () => {
  if (authStore.user && !authStore.userRoles.length) {
    await authStore.loadUserRoles()
  }
})
type SelectOption = { label: string; value: number | string }
const selectOptions = ref({
  users: [] as SelectOption[]
})

const getUsersOptions = async () => {
  const { data: allUsers } = await usersQuery
  if (!allUsers || allUsers.length === 0) {
    console.warn('No users found.')
    selectOptions.value.users = [] // Ensure options are empty
    return
  }

  selectOptions.value.users = allUsers.map((user) => ({
    label: user.full_name || user.username,
    value: user.id
  }))
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

  // Check for existing project with the same slug
  const { data: existingProject } = await getProjectBySlug(slug)
  if (existingProject) {
    console.error('A project with this slug already exists.')
    return
  }

  const projectPayload = {
    name: formData.name,
    description: formData.description || '',
    slug,
    status: 'in-progress' as const,
    owner_id: user.value.id,
    collaborators: formData.collaborators?.length
      ? [
          ...new Set(
            formData.collaborators
              .filter((collaborator) => user.value && collaborator !== user.value.id) // Exclude owner_id
              .map((collaborator) => collaborator.toString())
          )
        ]
      : [], // Default to an empty array if no collaborators
    assigned_to: formData.assigned_to || null // Default to null if not assigned
  }

  const { data: newProject, error: projectError } = await createNewProjectQuery(projectPayload)

  if (projectError || !newProject) {
    console.error('Project creation failed:', projectError)
    return
  }

  // Link the owner
  const { error: linkError } = await assignUserToProjectQuery({
    userId: user.value.id,
    projectId: newProject.id,
    role: 'owner',
    status: 'in-progress'
  })
  if (linkError) {
    console.error('Failed to link owner to project:', linkError)
    return
  }

  // Link collaborators (if any)
  if (formData.collaborators && formData.collaborators.length) {
    for (const collaboratorId of formData.collaborators) {
      // Skip if collaborator is the owner
      if (collaboratorId === user.value.id) continue
      const { error: collabError } = await assignUserToProjectQuery({
        userId: collaboratorId,
        projectId: newProject.id,
        role: 'member',
        status: 'in-progress'
      })
      if (collabError) {
        console.error(`Failed to link collaborator ${collaboratorId}:`, collabError)
        // Optionally, show a toast or continue
      }
    }
  }

  console.log('Project and user_project links created successfully:', newProject)
  sheetOpen.value = false

  router.push(`/projects/${newProject.slug}`)
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
