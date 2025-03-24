<template>
  <div>
    <Table v-if="project">
      <TableRow>
        <TableHead> Name </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="project.name" @commit="updateProject" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Description </TableHead>
        <TableCell>
          <AppInPlaceEditTextArea v-model="project.description" @commit="updateProject" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Project Owner </TableHead>
        <TableCell>{{ project.owner_id }}</TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Status </TableHead>
        <!-- TODO
use the component AppInPlaceEditStatus to edit the status of the project tasks
-->
        <AppInPlaceEditStatus v-model="project.status" @commit="updateProjectStatus($event)" />
      </TableRow>
      <TableRow>
        <TableHead> Collaborators </TableHead>
        <TableCell>
          <div class="flex">
            <Avatar
              class="-mr-4 transition-transform border-primary hover:scale-110"
              v-for="collab in collabs"
              :key="collab.id"
            >
              <RouterLink
                class="flex items-center justify-center w-full h-full"
                :to="{
                  name: '/users/[username]',
                  params: { username: collab.username }
                }"
              >
                <AvatarImage :src="collab.avatar_url || ''" alt="" />
                <AvatarFallback> </AvatarFallback>
              </RouterLink>
            </Avatar>
          </div>
        </TableCell>
      </TableRow>
    </Table>

    <section v-if="project" class="flex flex-col justify-between gap-5 mt-10 md:flex-row grow">
      <div class="flex-1">
        <h2>Tasks</h2>
        <div class="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead> Name </TableHead>
                <TableHead> Status </TableHead>
                <TableHead> Due Date </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="task in project.tasks" :key="task.id">
                <TableCell>Lorem ipsum dolor sit amet. </TableCell>
                <TableCell>
                  <AppInPlaceEditStatus v-model="task.status" @commit="updateProject" />
                </TableCell>
                <TableCell> 22/08/2024 </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <div class="flex-1">
        <h2>Documents</h2>
        <div class="table-container">
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
  </div>
</template>

<script setup lang="ts">
const { slug } = useRoute('/projects/[slug]').params

const projectsLoader = useProjectsStore()
const { project } = storeToRefs(projectsLoader)
const { getProject, updateProject, updateProjectStatus } = projectsLoader

watch(
  () => project.value?.name,
  () => {
    usePageStore().pageData.title = `Project: ${project.value?.name || ''}`
  }
)

await getProject(slug)
/* console.log('Project collaborators:', project.value?.collaborators) */

const { getUserByIds } = useCollabs()
const collabs = project.value?.collaborators ? await getUserByIds(project.value?.collaborators) : []
/* console.log(project.value)
console.log('Project collaborators:', project.value?.collaborators) */
</script>

<style scoped>
th {
  @apply w-[100px];
}

h2 {
  @apply mb-4 text-lg font-semibold w-fit;
}

.table-container {
  @apply overflow-hidden overflow-y-auto rounded-md bg-slate-900 h-80;
}
</style>
