<template>
  <!-- Sheet component that acts as a slide-in panel, controlled by the sheetOpen prop -->
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Create new task</SheetTitle>
      </SheetHeader>
      <!-- Form for creating a new task with validation that shows on submit -->
      <FormKit
        type="form"
        @submit="createTask"
        submit-label="Create Task"
        :config="{ validationVisibility: 'submit' }"
      >
        <!-- Task name input field with required validation -->
        <FormKit
          type="text"
          name="name"
          id="name"
          label="Name"
          placeholder="My new task"
          validation="required|length:1,255"
        />
        <!-- Project dropdown with dynamic options loaded from the database -->
        <FormKit
          type="select"
          name="project_id"
          id="project_id"
          label="Project"
          placeholder="Select a project"
          :options="selectOptions.projects"
          validation="required"
        />
        <!-- User assignment dropdown with dynamic options loaded from the database -->
        <FormKit
          type="select"
          name="assigned_to"
          id="assigned_to"
          label="User"
          placeholder="Select a user"
          :options="selectOptions.users"
          validation="required"
        />
        <!-- Optional task description textarea with length validation -->
        <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Description"
          placeholder="Task description"
          validation="length:0,500"
        />
        <!-- Task status dropdown with dynamic options loaded from the database -->
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

// Two-way binding for controlling the sheet's open/closed state
const sheetOpen = defineModel<boolean>()

// Type definition for dropdown options
type SelectOption = { label: string; value: number | string }

// Reactive object to store all dropdown options
const selectOptions = ref({
  projects: [] as SelectOption[],
  users: [] as SelectOption[],
  statuses: [] as SelectOption[]
})

/**
 * Fetches project data from the database and formats it for the dropdown
 * Each project is added as an option with name as label and id as value
 */
const getProjectsOptions = async () => {
  const { data: allProjects } = await projectsQuery

  if (!allProjects) return

  allProjects.forEach((project) => {
    selectOptions.value.projects.push({ label: project.name, value: project.id })
  })
}

/**
 * Fetches user data from the database and formats it for the dropdown
 * Each user is added as an option with full_name as label and id as value
 */
const getUsersOptions = async () => {
  const { data: allUsers } = await usersQuery

  if (!allUsers) return

  allUsers.forEach((user) => {
    selectOptions.value.users.push({ label: user.full_name, value: user.id })
  })
}

/**
 * Fetches task status data and formats it for the dropdown
 * Handles potential duplicate statuses by using a Map to track unique names
 * Each status is added with proper label, value, and color properties
 */
const getStatusOptions = async () => {
  // Clear existing options first to prevent duplicates on re-fetch
  selectOptions.value.statuses = []

  const { data: allStatuses, error } = await taskStatusesQuery()

  if (error || !allStatuses) {
    console.error('Failed to fetch statuses:', error)
    return
  }

  console.log('Raw status data:', allStatuses)

  // Use a Map to track unique names (case insensitive) and prevent duplicates
  const uniqueStatuses = new Map()

  allStatuses.forEach((status) => {
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

/**
 * Convenience function to fetch all options in parallel
 * Called immediately when component is mounted
 */
const getOptions = async () => {
  await Promise.all([getProjectsOptions(), getUsersOptions(), getStatusOptions()])
}

// Initialize all dropdown options when component mounts
getOptions()

// Get current authenticated user from auth store for task ownership
const { user } = storeToRefs(useAuthStore())
const router = useRouter()

/**
 * Handles the form submission to create a new task
 * Validates required fields, prepares data for database, and handles navigation after success
 *
 * @param {CreateNewTask} formData - The form data collected from inputs
 */
const createTask = async (formData: CreateNewTask) => {
  try {
    // Validate required fields before submission
    if (!formData.name || !formData.project_id || !formData.assigned_to) {
      console.error('Required fields are missing:', {
        name: !!formData.name,
        project_id: !!formData.project_id,
        profile_id: !!formData.id
      })
      return
    }

    // Prepare task object with additional data not from the form
    const task = {
      ...formData,
      owner_id: user.value?.id || null,
      tags: [],
      collaborators: user.value?.id ? [user.value.id] : [],
      status_id: formData.status_id
    }

    // Send task data to database via query function
    const { error, data }: { error: any; data: { id: number } | { id: number }[] | null } =
      await createNewTaskQuery(task)

    if (error) {
      console.error('Task creation failed:', error)
      return
    }
    console.log('Task created successfully:')

    // Close the form sheet on successful submission
    sheetOpen.value = false

    // Redirect to the newly created task detail page
    if (data) {
      router.push(`/tasks/${Array.isArray(data) ? data[0]?.id : data?.id}`)
    }

    // Optional: Reset form data if needed
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
