<template>
  <!-- Main container centering content -->
  <div class="flex flex-col items-center justify-center">
    <Table>
      <!-- Editable task name -->
      <TableRow v-if="task">
        <TableHead> Name </TableHead>
        <TableCell>
          <!-- Inline editable input bound to task.name -->
          <AppInPlaceEditText v-model="task.name" @commit="updateTask" />
        </TableCell>
      </TableRow>

      <!-- Editable task description -->
      <TableRow>
        <TableHead> Description </TableHead>
        <TableCell>
          <!-- Multiline input for task description -->
          <AppInPlaceEditTextArea
            v-if="task"
            class="h-20"
            v-model="task.description"
            @commit="updateTask"
          />
        </TableCell>
      </TableRow>

      <!-- Display assigned user -->
      <TableRow>
        <TableHead> Assignee </TableHead>
        <TableCell>{{ task?.users.username }}</TableCell>
      </TableRow>

      <!-- Display project name -->
      <TableRow>
        <TableHead> Project </TableHead>
        <TableCell>{{ task?.projects.name }}</TableCell>
      </TableRow>

      <!-- Display project ID -->
      <TableRow>
        <TableHead> Project Id: </TableHead>
        <TableCell> {{ task?.project_id }} </TableCell>
      </TableRow>

      <!-- Editable task status using custom input -->
      <TableRow>
        <TableHead> Status </TableHead>
        <AppInPlaceEditStatus v-if="task" v-model="task.status_id" @commit="updateTask" />
      </TableRow>

      <!-- Alternate task status selector with dropdown -->
      <TableRow>
        <TableHead> Status </TableHead>
        <TableCell>
          <TaskStatusSelector
            v-if="task"
            v-model="task.status_id"
            :task-id="task?.id"
            @commit="updateTask"
            aria-label="Change task status"
          />
        </TableCell>
      </TableRow>

      <!-- Display avatars of all collaborators -->
      <TableRow>
        <TableHead> Collaborators </TableHead>
        <TableCell>
          <div class="flex">
            <!-- Render each collaborator's avatar with link to their profile -->
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

      <!-- Comment section -->
      <TableRow class="hover:bg-transparent">
        <TableHead class="pt-4 align-top"> Comments </TableHead>
        <TableCell>
          <!-- Show loading indicator while fetching comments -->
          <div v-if="loading" class="text-sm text-muted-foreground">Loading comments...</div>

          <!-- Render list of comments if any exist -->
          <div v-else-if="comments.length" class="mb-4 space-y-4">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="p-3 border rounded-md shadow-sm bg-muted"
            >
              <div class="flex items-center justify-between mb-1">
                <!-- Display comment author -->
                <div class="text-sm font-medium text-primary">
                  {{ comment.users?.username || 'Unknown User' }}
                </div>
                <!-- Display formatted timestamp -->
                <div class="text-xs text-muted-foreground">
                  {{ new Date(comment.created_at).toLocaleString() }}
                </div>
              </div>
              <!-- Display comment content -->
              <!-- Show textarea if editing this comment -->
              <div v-if="editingCommentId === comment.id" class="space-y-2">
                <textarea
                  v-model="editedContent"
                  class="w-full p-2 text-sm border rounded bg-background border-muted"
                ></textarea>
                <div class="flex gap-2">
                  <Button size="sm" @click="submitEdit(comment.id)">Save</Button>
                  <Button variant="ghost" size="sm" @click="cancelEdit">Cancel</Button>
                  <Button variant="destructive" size="sm" @click="deleteComment(comment.id)"
                    >Delete</Button
                  >
                </div>
              </div>

              <!-- Otherwise show static comment content and edit button -->
              <div v-else class="flex justify-between text-sm text-muted-foreground">
                <span>{{ comment.content }}</span>
                <!-- Edit button (visible only if this user wrote the comment) -->
                <button
                  class="text-xs underline hover:text-primary"
                  @click="startEdit(comment)"
                  v-if="user?.id === comment.user_id"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          <!-- Optional: Show comment count -->
          <div v-if="comments.length">Comments count: {{ comments.length }}</div>

          <!-- Fallback when no comments exist -->
          <div v-else class="mb-4 text-sm italic text-muted-foreground">No comments yet.</div>

          <!-- Comment input form -->
          <div class="flex flex-col justify-between p-3 mt-2 rounded-md bg-muted">
            <!-- Textarea bound to commentInput -->
            <textarea
              v-model="commentInput"
              placeholder="Add your comment..."
              class="w-full max-w-full p-3 overflow-y-auto prose-sm prose border rounded dark:prose-invert hover:border-muted bg-background border-muted"
            ></textarea>

            <!-- Comment action buttons -->
            <div class="flex justify-between mt-3">
              <!-- Submit comment -->
              <Button @click="submitComment">Comment</Button>

              <!-- Optional file/image upload buttons (non-functional) -->
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

    <!-- Delete task button with loading indicator -->
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/loaders/tasks'
import { useAuthStore } from '@/stores/auth'
import { useCommentsStore } from '@/stores/loaders/comments'
import { supabase } from '@/lib/supabaseClient'

// Route param
const { id } = useRoute('/tasks/[id]').params

// Stores
const auth = useAuthStore()
const { user } = storeToRefs(auth)

const commentsStore = useCommentsStore()
const { comments, loading } = storeToRefs(commentsStore)
const { getComments, postComment } = commentsStore

const tasksLoader = useTasksStore()
const { task } = storeToRefs(tasksLoader)
const { getTask, updateTask, deleteTask } = tasksLoader

// Comment input
const commentInput = ref('')
/* onMounted(async () => {
  await getTask(id)

  if (task.value?.id) {
    await getComments({ taskId: task.value.id })
  }
}) */

// Set page title when task name is available
/* watch(
  () => task.value?.name,
  () => {
    usePageStore().pageData.title = `Task: ${task.value?.name || ''}`
  }
) */

// Load task and comments
/* onMounted(() => {
  getTask(id)
}) */

// Load comments when task ID is ready
/* watch(
  () => task.value?.id,
  (taskId) => {
    if (taskId) getComments({ taskId })
  },
  { immediate: true }
) */
onMounted(async () => {
  await getTask(id)
  if (task.value?.id) {
    await getComments({ taskId: task.value.id })
  }
})

// Submit new comment
const submitComment = async () => {
  if (!commentInput.value.trim() || !user.value?.id || !task.value?.id) return

  const result = await postComment({
    content: commentInput.value,
    taskId: task.value.id,
    userId: user.value.id
  })
  console.log('🟢 New comment added:', result)
  commentInput.value = ''
}

// Collaborators
const { getUserByIds } = useCollabs()
const collabs = task.value?.collaborators ? await getUserByIds(task.value?.collaborators) : []

// Delete task
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
  } finally {
    loadingDelete.value = false
  }
}
const editingCommentId = ref<string | null>(null)
const editedContent = ref('')

// Start editing
const startEdit = (comment: Comment) => {
  editingCommentId.value = comment.id
  editedContent.value = comment.content
}

// Cancel editing
const cancelEdit = () => {
  editingCommentId.value = null
  editedContent.value = ''
}

// Update comment in Supabase
const submitEdit = async (commentId: string) => {
  if (!editedContent.value.trim()) return

  // Update via Supabase (create this helper if needed)
  await supabase.from('comments').update({ content: editedContent.value }).eq('id', commentId)

  // Update local state manually
  const index = comments.value.findIndex((c) => c.id === commentId)
  if (index !== -1) {
    comments.value[index].content = editedContent.value
  }

  cancelEdit()
}
const deleteComment = async (commentId: string) => {
  const { error } = await supabase.from('comments').delete().eq('id', commentId)

  if (error) {
    console.error('Error deleting comment:', error)
    return
  }

  // Remove from local state
  comments.value = comments.value.filter((comment) => comment.id !== commentId)

  // If we were editing this comment, cancel editing
  if (editingCommentId.value === commentId) {
    cancelEdit()
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
