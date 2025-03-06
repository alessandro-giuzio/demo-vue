<template>
  <Table>
    <TableRow v-if="task">
      <TableHead> Name </TableHead>
      <TableCell> {{ task.name }} </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Description </TableHead>
      <TableCell>
        {{ task?.description }}
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Assignee </TableHead>
      <TableCell>{{ task?.users.username }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Project </TableHead>
      <TableCell>{{ task?.projects.name }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Project Id: </TableHead>
      <TableCell> {{ task?.project_id }} </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Status </TableHead>
      <AppInPlaceEditStatus v-if="task" v-model="task.status" @commit="updateTask" />
    </TableRow>
    <TableRow>
      <TableHead> Collaborators </TableHead>
      <TableCell>
        <div class="flex">
          <Avatar
            class="-mr-4 transition-transform border border-primary hover:scale-110"
            v-for="n in 5"
            :key="n"
          >
            <RouterLink class="flex items-center justify-center w-full h-full" to="">
              <AvatarImage src="" alt="" />
              <AvatarFallback> </AvatarFallback>
            </RouterLink>
          </Avatar>
        </div>
      </TableCell>
    </TableRow>
    <TableRow class="hover:bg-transparent">
      <TableHead class="pt-4 align-top"> Comments </TableHead>

      <TableCell>
        Comments cards goes in here..

        <div class="flex flex-col justify-between p-3 my-2 rounded-md bg-muted">
          <textarea
            placeholder="Add your comment.."
            class="w-full max-w-full p-3 overflow-y-auto prose-sm prose border rounded dark:prose-invert hover:border-muted bg-background border-muted"
          >
          </textarea>
          <div class="flex justify-between mt-3">
            <Button> Comment </Button>
            <div class="flex gap-4">
              <button variant="ghost" @click.prevent>
                <iconify-icon icon="lucide:paperclip"></iconify-icon>
                <span class="sr-only">Attach file</span>
              </button>
              <button variant="ghost" @click.prevent>
                <iconify-icon icon="lucide:image-up"></iconify-icon>

                <span class="sr-only">Upload image</span>
              </button>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  </Table>
</template>

<script setup lang="ts">
import type { Task } from '@/utils/supaQueries'
import { taskQuery } from '@/utils/supaQueries'
const projectsLoader = useProjectsStore()
const { updateTask } = projectsLoader
const route = useRoute('/tasks/[id]')

const task = ref<Task | null>(null)

watch(
  () => task.value?.name,
  () => {
    usePageStore().pageData.title = `Task: ${task.value?.name}`
  }
)

const getTask = async () => {
  const { data, error, status } = await taskQuery(route.params.id)
  if (error) useErrorStore().setError({ error, customCode: status })

  task.value = data
}

await getTask()
</script>
