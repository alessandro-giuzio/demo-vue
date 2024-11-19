<template>
  <!-- Main Table displaying project details -->
  <Table v-if="project">
    <!-- Row displaying the project name -->
    <TableRow>
      <TableHead> Name </TableHead>
      <TableCell>
        <AppInPlaceEditText v-model="project.name" @commit="updateProject" />
      </TableCell>
    </TableRow>
    <!-- Row displaying the project description -->
    <TableRow>
      <TableHead> Description </TableHead>
      <TableCell>
        {{ project.description }}
      </TableCell>
    </TableRow>
    <!-- Row displaying the project status -->
    <TableRow>
      <TableHead> Status </TableHead>
      <TableCell>{{ project.status }}</TableCell>
    </TableRow>
    <!-- Row displaying project collaborators -->
    <TableRow>
      <TableHead> Collaborators </TableHead>
      <TableCell>
        <div class="flex">
          <!-- Avatar components for each collaborator -->
          <Avatar
            class="-mr-4 transition-transform border border-primary hover:scale-110"
            v-for="collab in project.collaborators"
            :key="collab"
          >
            <RouterLink class="flex items-center justify-center w-full h-full" to="">
              <AvatarImage src="" alt="" />
              <AvatarFallback> </AvatarFallback>
            </RouterLink>
          </Avatar>
        </div>
      </TableCell>
    </TableRow>
  </Table>
  <!-- Section for displaying tasks and documents -->
  <section v-if="project" class="flex flex-col justify-between gap-5 mt-10 md:flex-row grow">
    <!-- Tasks section -->
    <div class="flex-1">
      <h2>Tasks</h2>
      <div class="table-container">
        <Table>
          <TableHeader>
            <!-- Header for tasks table -->
            <TableRow>
              <TableHead> Name </TableHead>
              <TableHead> Status </TableHead>
              <TableHead> Due Date </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- Rows for tasks data, looped for multiple tasks -->
            <TableRow v-for="task in project.tasks" :key="task.id">
              <TableCell> {{ task.name }} </TableCell>
              <TableCell> {{ task.status }} </TableCell>
              <TableCell> {{ task.due_date }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
    <!-- Documents section -->
    <div class="flex-1">
      <h2>Documents</h2>
      <div class="table-container">
        <!-- Message indicating no documents are available -->
        <p class="px-4 py-3 text-sm font-semibold text-muted-foreground">
          This project doesn't have documents yet...
        </p>
        <!-- <Table>
          <TableHeader>
            <TableRow>
              <TableHead> Name </TableHead>
              <TableHead> Visibility </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell> Lorem ipsum dolor sit amet. </TableCell>
              <TableCell> Private </TableCell>
            </TableRow>
          </TableBody>
        </Table> -->
      </div>
    </div>
  </section>
</template>

<style>
/* Styling for table header cells */
th {
  @apply w-[100px];
}

/* Styling for section headings */
h2 {
  @apply mb-4 text-lg font-semibold w-fit;
}

/* Styling for the container of tables with overflow handling */
.table-container {
  @apply overflow-hidden overflow-y-auto rounded-md bg-slate-900 h-80;
}
</style>

<script setup lang="ts">
import AppInPlaceEditText from '@/components/AppInPlaceEdit/AppInPlaceEditText.vue'

// initialize useRoute to access route parameters and metadata
const { slug } = useRoute('/projects/[slug]').params
// Initialize the store
const projectsLoader = useProjectsStore()
const { project } = storeToRefs(projectsLoader)
const { getProject, updateProject } = projectsLoader
// Watch for changes to the project's name and update page title accordingly
watch(
  () => project.value?.name,
  () => {
    usePageStore().pageData.title = `Project: ${project.value?.name || ''}`
  }
)

// Fetch the project data when the component is mounted
await getProject(slug)
</script>
