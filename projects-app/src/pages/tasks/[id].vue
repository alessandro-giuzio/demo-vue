<template>
  <div class="flex flex-col items-center justify-center">
    <Table>
      <TableRow v-if="task">
        <TableHead> Name </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="task.name" @commit="updateTask" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Description </TableHead>
        <TableCell>
          <AppInPlaceEditTextArea
            v-if="task"
            class="h-20"
            v-model="task.description"
            @commit="updateTask"
          />
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
        <AppInPlaceEditStatus v-if="task" v-model="task.status_id" @commit="updateTask" />
      </TableRow>
      <TableRow>
        <TableHead> Collaborators </TableHead>
        <TableCell>
          <div class="flex">
            <Avatar
              class="-mr-4 transition-transform border border-primary hover:scale-110"
              v-for="collab in collabs"
              :key="collab.id"
            >
              <RouterLink
                class="flex items-center justify-center w-full h-full"
                :to="`/users/${collab.username}`"
              >
                <AvatarImage :src="collab.avatar_url || ''" alt="" />
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
    <Button class="self-end w-full mt-3 max-w-40" variant="destructive" @click="triggerDeleteTask">
      <Transition name="scale" mode="out-in">
        <iconify-icon
          v-if="loadingDelete"
          icon="lucide:loader-circle"
          class="mr-1 animate-spin"
        ></iconify-icon>
        <iconify-icon v-else icon="lucide:trash" class="mr-1"></iconify-icon>
      </Transition>
      Delete Task
    </Button>
  </div>
</template>

<script setup lang="ts">
const { id } = useRoute('/tasks/[id]').params

import { useTasksStore } from '@/stores/loaders/tasks'

const tasksLoader = useTasksStore()
const { task } = storeToRefs(tasksLoader)
const { getTask, updateTask, deleteTask } = tasksLoader

watch(
  () => task.value?.name,
  () => {
    usePageStore().pageData.title = `Task: ${task.value?.name || ''}`
  }
)

await getTask(id)

const { getUserByIds } = useCollabs()

const collabs = task.value?.collaborators ? await getUserByIds(task.value?.collaborators) : []

const loadingDelete = ref(false)
const router = useRouter()
const triggerDeleteTask = async () => {
  if (!task.value?.id) {
    console.error('No task selected for deletion')
    return
  }

  try {
    loadingDelete.value = true
    await deleteTask()
    await router.push('/tasks')
  } catch (error) {
    console.error('Failed to delete task:', error)
    // Optionally show error to user via toast/notification
  } finally {
    loadingDelete.value = false
  }
}
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
