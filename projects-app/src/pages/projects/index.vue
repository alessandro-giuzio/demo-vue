<template>
  <!-- <div>
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon" class="w-8 h-8">
          <iconify-icon icon="lucide:plus"></iconify-icon>
        </Button>
        Add New Project
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form action="submit">
          <input type="text" name="name" id="name" placeholder="Project name" />
          <input
            type="text"
            name="description"
            id="description"
            placeholder="Project description"
          />
          <input type="text" name="status" id="status" placeholder="Project status" />
          <input type="text" name="dueDate" id="dueDate" placeholder="Due date" />
        </form>
        <DialogFooter> Save changes </DialogFooter>
      </DialogContent>
    </Dialog>
  </div> -->

  <DataTable
    v-if="filteredProjects.length"
    :columns="columnsWithCollabs"
    :data="filteredProjects"
  />
  <p v-else>No projects found for the logged-in user.</p>
</template>

<script setup lang="ts">
import { useCollabs } from '@/composables/collabs'
import { useProjectsStore } from '@/stores/loaders/projects'
import { filterProjectsForUser } from '@/utils/supaQueries'
import { columns } from '@/utils/tableColumns/projectsColumns'

// Set the page title
usePageStore().pageData.title = 'My Projects'

// Initialize the projects store
const projectsLoader = useProjectsStore()
const { projects } = storeToRefs(projectsLoader)
const { getProjects } = projectsLoader

// Get the logged-in user's registration details
const { userReg } = storeToRefs(useAuthStore())

// Fetch projects for the logged-in user
await getProjects()

// Filter projects for the logged-in user
const filteredProjects = userReg.value?.id ? await filterProjectsForUser(userReg.value.id) : []

// Initialize the collaborators composable
const { getGroupedCollabs, groupedCollabs } = useCollabs()

// Fetch and group collaborators for the projects
await getGroupedCollabs(filteredProjects)

// Log the grouped collaborators for debugging
console.log('TEST::' + JSON.stringify(groupedCollabs.value))

// Define the columns with collaborators
const columnsWithCollabs = columns(groupedCollabs)

// Define the PAge Title
useMeta({
  title: 'Projects',
  description: {
    name: 'description',
    content: 'This is the projects page'
  }
})
</script>
