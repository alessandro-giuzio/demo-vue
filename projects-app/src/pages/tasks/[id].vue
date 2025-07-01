<template>
  <!-- Hidden file inputs -->
  <input
    ref="fileInputRef"
    type="file"
    multiple
    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
    @change="handleFileSelection"
    style="display: none"
  />

  <input
    ref="imageInputRef"
    type="file"
    multiple
    accept="image/*"
    @change="handleFileSelection"
    style="display: none"
  />

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
      <!--    <TableRow>
        <TableHead> Status </TableHead>
        <AppInPlaceEditStatus v-if="task" v-model="task.status_id" @commit="updateTask" />
      </TableRow> -->

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
          <!-- Render list of comments if any exist -->
          <div v-else-if="comments.length" class="mb-4 space-y-4">
            <div
              v-for="comment in [...comments]"
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

              <!-- Show textarea if editing this comment -->
              <div v-if="editingCommentId === comment.id" class="space-y-3">
                <textarea
                  v-model="editedContent"
                  class="w-full p-2 text-sm border rounded bg-background border-muted"
                ></textarea>

                <!-- Attachments section with delete buttons -->
                <div v-if="editingAttachments.length > 0" class="mt-2 border-t border-muted pt-2">
                  <div class="text-sm font-medium mb-1">Attachments:</div>

                  <!-- Images with delete buttons -->
                  <div
                    v-if="editingImages.length > 0"
                    class="grid grid-cols-2 gap-2 my-2 sm:grid-cols-3"
                  >
                    <div
                      v-for="(image, index) in editingImages"
                      :key="index"
                      class="relative group overflow-hidden rounded-md border border-muted aspect-square"
                    >
                      <img
                        :src="image.url"
                        :alt="image.name"
                        class="absolute inset-0 w-full h-full object-cover"
                      />
                      <button
                        @click="removeAttachment(index, 'image')"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <iconify-icon icon="lucide:x" class="text-xs"></iconify-icon>
                      </button>
                    </div>
                  </div>

                  <!-- Files with delete buttons -->
                  <div v-if="editingFiles.length > 0" class="space-y-1 my-2">
                    <div
                      v-for="(file, index) in editingFiles"
                      :key="index"
                      class="flex items-center justify-between p-2 border rounded-md border-muted hover:bg-muted/30 group"
                    >
                      <div class="flex items-center gap-2 truncate">
                        <iconify-icon
                          :icon="
                            file.type === 'pdf'
                              ? 'lucide:file-text'
                              : file.type === 'document'
                                ? 'lucide:file-text'
                                : file.type === 'spreadsheet'
                                  ? 'lucide:file-spreadsheet'
                                  : 'lucide:file'
                          "
                          class="text-muted-foreground"
                        ></iconify-icon>
                        <span class="text-sm truncate">{{ file.name }}</span>
                      </div>
                      <button
                        @click="removeAttachment(index, 'file')"
                        class="text-red-500 p-1 hover:text-red-700"
                        title="Remove file"
                      >
                        <iconify-icon icon="lucide:trash-2" class="text-sm"></iconify-icon>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="flex gap-2">
                  <Button size="sm" @click="submitEdit(comment.id)">Save</Button>
                  <Button variant="ghost" size="sm" @click="cancelEdit">Cancel</Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    @click="deleteComment(comment.id, comment.content)"
                    :disabled="loadingDelete"
                  >
                    <iconify-icon icon="lucide:trash" class="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              <!-- Otherwise show static comment content and edit button -->
              <div v-else>
                <!-- Comment text content -->
                <div class="mb-2 text-sm text-muted-foreground">
                  {{ extractCommentText(comment.content) }}
                </div>

                <!-- Images grid -->
                <div
                  v-if="getImageAttachments(comment.content).length"
                  class="grid grid-cols-2 gap-2 my-2 sm:grid-cols-3 md:grid-cols-4"
                >
                  <a
                    v-for="image in getImageAttachments(comment.content)"
                    :key="image.url"
                    :href="image.url"
                    target="_blank"
                    class="relative block overflow-hidden border rounded-md aspect-square border-muted bg-muted-foreground/10"
                  >
                    <img
                      :src="image.url"
                      :alt="image.name"
                      class="absolute inset-0 object-cover w-full h-full transition-transform hover:scale-105"
                      loading="lazy"
                    />
                  </a>
                </div>

                <!-- Other file types -->
                <div v-if="getFileAttachments(comment.content).length" class="my-2 space-y-1">
                  <a
                    v-for="file in getFileAttachments(comment.content)"
                    :key="file.url"
                    :href="file.url"
                    target="_blank"
                    class="flex items-center gap-2 p-2 border rounded-md border-muted hover:bg-muted/50 group"
                  >
                    <!-- File icon based on type -->
                    <div class="text-muted-foreground">
                      <iconify-icon
                        :icon="
                          file.type === 'pdf'
                            ? 'lucide:file-text'
                            : file.type === 'document'
                              ? 'lucide:file-text'
                              : file.type === 'spreadsheet'
                                ? 'lucide:file-spreadsheet'
                                : file.type === 'presentation'
                                  ? 'lucide:file-presentation'
                                  : 'lucide:file'
                        "
                        class="text-lg"
                      ></iconify-icon>
                    </div>

                    <!-- File name -->
                    <div class="flex-1 text-sm truncate">
                      {{ file.name }}
                    </div>

                    <!-- Download icon -->
                    <div
                      class="transition-opacity opacity-0 text-muted-foreground group-hover:opacity-100"
                    >
                      <iconify-icon icon="lucide:download" class="text-sm"></iconify-icon>
                    </div>
                  </a>
                </div>

                <!-- Edit button (visible only if this user wrote the comment) -->
                <div class="flex justify-end mt-1">
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
          </div>

          <!--  Show comment count -->
          <div v-if="comments.length">Comments count: {{ comments.length }}</div>

          <!-- Fallback when no comments exist -->
          <div v-else class="mb-4 text-sm italic text-muted-foreground">No comments yet.</div>

          <!-- File upload queue display -->
          <!-- File upload queue display -->
          <div v-if="fileUploadStore.hasFiles" class="mb-4">
            <div class="space-y-2">
              <div
                v-for="item in fileUploadStore.uploadQueue"
                :key="item.id"
                class="flex items-center justify-between p-2 bg-gray-100 rounded dark:bg-gray-700"
              >
                <div class="flex items-center gap-2">
                  <iconify-icon
                    :icon="item.file.type.startsWith('image/') ? 'lucide:image' : 'lucide:file'"
                    class="text-sm"
                  ></iconify-icon>
                  <span class="text-sm">{{ item.file.name }}</span>
                  <span class="text-xs text-gray-500"
                    >({{ (item.file.size / 1024 / 1024).toFixed(1) }}MB)</span
                  >
                </div>

                <div class="flex items-center gap-2">
                  <!-- Progress/Status indicator -->
                  <div v-if="item.status === 'uploading'" class="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      class="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                      :style="{ width: `${item.progress}%` }"
                    ></div>
                  </div>

                  <iconify-icon
                    v-else-if="item.status === 'completed'"
                    icon="lucide:check-circle"
                    class="text-green-500"
                  ></iconify-icon>

                  <iconify-icon
                    v-else-if="item.status === 'error'"
                    icon="lucide:x-circle"
                    class="text-red-500"
                  ></iconify-icon>

                  <!-- Remove button - Updated to use deleteFile -->
                  <button
                    @click="fileUploadStore.deleteFile(item.id)"
                    class="p-1 text-xs text-red-500 hover:text-red-700"
                    :disabled="item.status === 'uploading'"
                  >
                    <iconify-icon icon="lucide:trash-2" class="text-sm"></iconify-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

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
              <Button
                @click="submitComment"
                :disabled="
                  fileUploadStore.isUploading || (!commentInput.trim() && !fileUploadStore.hasFiles)
                "
              >
                <span v-if="fileUploadStore.isUploading">
                  <iconify-icon icon="lucide:loader-2" class="mr-2 animate-spin"></iconify-icon>
                  Uploading...
                </span>
                <span v-else>Comment</span>
              </Button>

              <!-- File upload buttons -->
              <div class="flex gap-4">
                <button
                  @click="triggerFileUpload"
                  :disabled="fileUploadStore.isUploading"
                  class="p-2 rounded hover:bg-gray-100"
                >
                  <iconify-icon icon="lucide:paperclip"></iconify-icon>
                  <span class="sr-only">Attach file</span>
                </button>
                <button
                  @click="triggerImageUpload"
                  :disabled="fileUploadStore.isUploading"
                  class="p-2 rounded hover:bg-gray-100"
                >
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
import { useFileUploadStore } from '@/stores/loaders/storage'
import { supabase } from '@/lib/supabaseClient'

// Add these helper functions after your existing imports
const getAttachmentsFromComment = (content: string) => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  const attachments = []
  let match

  while ((match = regex.exec(content)) !== null) {
    attachments.push({
      name: match[1],
      url: match[2],
      type: getFileTypeFromUrl(match[2], match[1])
    })
  }

  return attachments
}

// Extract comment text without the attachment markdown
const extractCommentText = (content: string) => {
  // Remove the attachments section and markdown links
  return content
    .replace(/\*\*Attachments:\*\*\n(.*)/s, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '')
    .trim()
}

// Determine file type from URL or name
const getFileTypeFromUrl = (url: string, filename: string) => {
  // Get extension from filename or URL
  const extension = filename.split('.').pop()?.toLowerCase() || url.split('.').pop()?.toLowerCase()

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'image'
  }

  if (extension === 'pdf') return 'pdf'
  if (['doc', 'docx'].includes(extension || '')) return 'document'
  if (['xls', 'xlsx', 'csv'].includes(extension || '')) return 'spreadsheet'
  if (['ppt', 'pptx'].includes(extension || '')) return 'presentation'
  if (['txt', 'md'].includes(extension || '')) return 'text'

  return 'file'
}

// Separate attachments into images and files
const getImageAttachments = (content: string) => {
  return getAttachmentsFromComment(content).filter((att) => att.type === 'image')
}

const getFileAttachments = (content: string) => {
  return getAttachmentsFromComment(content).filter((att) => att.type !== 'image')
}

// Format readable file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

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

const fileUploadStore = useFileUploadStore()

// File input refs
const fileInputRef = ref<HTMLInputElement | null>(null)
const imageInputRef = ref<HTMLInputElement | null>(null)

// Comment input
const commentInput = ref('')

// File handling functions
const triggerFileUpload = () => {
  fileInputRef.value?.click()
}

const triggerImageUpload = () => {
  imageInputRef.value?.click()
}

const handleFileSelection = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const files = Array.from(target.files)
    const { added, rejected } = fileUploadStore.addFilesWithValidation(files)

    if (rejected.length > 0) {
      console.warn('Some files were rejected:', rejected)
    }

    // Reset input
    if (target) target.value = ''
  }
}

// Submit new comment with file uploads
const submitComment = async () => {
  // Form validation
  if (!commentInput.value.trim() && !fileUploadStore.hasFiles) return
  if (!user.value?.id || !task.value?.id) return

  try {
    let attachmentUrls: string[] = []

    // Upload pending files first
    if (fileUploadStore.pendingCount > 0) {
      try {
        attachmentUrls = await fileUploadStore.uploadAllFiles()

        // Log success
        console.log('Files uploaded successfully:', attachmentUrls)
      } catch (uploadError) {
        console.error('Upload error:', uploadError)
        // Show a user-friendly error message (using your preferred notification system)
        alert(`File upload failed: ${uploadError.message}`)
        return // Stop the submission if uploads fail
      }
    }

    // Get completed files
    const completedFiles = fileUploadStore.getCompletedFiles()
    attachmentUrls = [...attachmentUrls, ...completedFiles.map((f) => f.url)]

    // Prepare comment content with attachments
    let commentContent = commentInput.value
    if (attachmentUrls.length > 0) {
      const fileList = fileUploadStore.uploadQueue
        .filter((item) => item.status === 'completed')
        .map((item) => `[${item.file.name}](${item.url})`)
        .join('\n')

      commentContent = commentInput.value
        ? `${commentInput.value}\n\n**Attachments:**\n${fileList}`
        : `**Attachments:**\n${fileList}`
    }

    // Submit comment
    const result = await postComment({
      content: commentContent,
      taskId: task.value.id,
      userId: user.value.id
    })

    console.log('🟢 New comment added:', result)

    // Reset form
    commentInput.value = ''
    fileUploadStore.clearAll()
  } catch (error) {
    console.error('Failed to submit comment:', error)
  }
}

// Load task and comments on mount
onMounted(async () => {
  await getTask(id)
  if (task.value?.id) {
    await getComments({ taskId: task.value.id })
  }
})

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

// Comment editing
const editingCommentId = ref<string | null>(null)
const editedContent = ref('')
interface Attachment {
  name: string
  url: string
  type: string
}

const editingAttachments = ref<Attachment[]>([])
const editingImages = computed(() => editingAttachments.value.filter((att) => att.type === 'image'))
const editingFiles = computed(() => editingAttachments.value.filter((att) => att.type !== 'image'))

// Start editing
const startEdit = (comment: Comment) => {
  editingCommentId.value = comment.id
  editedContent.value = extractCommentText(comment.content)
  editingAttachments.value = getAttachmentsFromComment(comment.content)
}

// Cancel editing
const cancelEdit = () => {
  editingCommentId.value = null
  editedContent.value = ''
  editingAttachments.value = []
}

// Remove an attachment during editing
const removeAttachment = (index: number, type: 'image' | 'file') => {
  // Calculate actual index based on filtered arrays
  const startIndex =
    type === 'image'
      ? editingAttachments.value.findIndex((att) => att.type === 'image')
      : editingAttachments.value.findIndex((att) => att.type !== 'image')

  const actualIndex = type === 'image' ? startIndex + index : startIndex + index

  // Remove from the array
  if (actualIndex >= 0 && actualIndex < editingAttachments.value.length) {
    editingAttachments.value.splice(actualIndex, 1)
  }
}

// Update comment in Supabase with file cleanup
const submitEdit = async (commentId: string) => {
  if (!editedContent.value.trim() && editingAttachments.value.length === 0) return

  try {
    const commentToUpdate = comments.value.find((comment) => comment.id === commentId)

    if (!commentToUpdate) {
      console.error('Comment not found for editing:', commentId)
      return
    }

    // Extract files from original content
    const originalAttachments = getAttachmentsFromComment(commentToUpdate.content)

    // Find files that were removed during editing
    const keptUrls = new Set(editingAttachments.value.map((a) => a.url))
    const removedFiles = originalAttachments.filter((a) => !keptUrls.has(a.url))

    // Prepare new content with remaining attachments
    let newContent = editedContent.value.trim()

    if (editingAttachments.value.length > 0) {
      // Format attachment links
      const attachmentLinks = editingAttachments.value
        .map((att) => `[${att.name}](${att.url})`)
        .join('\n')

      // Add attachments section if there's content
      newContent = newContent
        ? `${newContent}\n\n**Attachments:**\n${attachmentLinks}`
        : `**Attachments:**\n${attachmentLinks}`
    }

    // Update comment in database
    const { error } = await supabase
      .from('comments')
      .update({ content: newContent })
      .eq('id', commentId)

    if (error) {
      console.error('Error updating comment:', error)
      return
    }

    // Delete removed files from storage
    if (removedFiles.length > 0) {
      console.log('Cleaning up removed files:', removedFiles.length)

      // Import the deleteFileFromStorage function
      const { deleteFileFromStorage } = await import('@/utils/supaQueries')

      // Delete each removed file
      for (const file of removedFiles) {
        try {
          await deleteFileFromStorage(file.url)
          console.log(`Deleted file: ${file.name}`)
        } catch (fileError) {
          console.error(`Failed to delete file ${file.name}:`, fileError)
        }
      }
    }

    // Update local state
    const index = comments.value.findIndex((c) => c.id === commentId)
    if (index !== -1) {
      comments.value[index].content = newContent
    }

    cancelEdit()
  } catch (error) {
    console.error('Error during comment update process:', error)
  }
}

// Delete comment
// Delete comment with file cleanup
const deleteComment = async (commentId: string, content: string) => {
  const commentToDelete = comments.value.find((comment) => comment.id === commentId)

  if (!commentToDelete) {
    console.error('Comment not found:', commentId)
    return
  }

  try {
    // Extract file URLs from comment content
    const attachments = getAttachmentsFromComment(commentToDelete.content)

    // Delete the comment from the database first
    const { error } = await supabase.from('comments').delete().eq('id', commentId)

    if (error) {
      console.error('Error deleting comment:', error)
      return
    }

    // If comment deletion was successful, clean up the files
    if (attachments.length > 0) {
      console.log('Cleaning up attached files:', attachments.length)

      // Import the deleteFileFromStorage function
      const { deleteFileFromStorage } = await import('@/utils/supaQueries')

      // Delete each file
      for (const attachment of attachments) {
        try {
          await deleteFileFromStorage(attachment.url)
        } catch (fileError) {
          console.error(`Failed to delete file ${attachment.name}:`, fileError)
          // Continue with other files even if one fails
        }
      }
    }

    // Remove from local state
    comments.value = comments.value.filter((comment) => comment.id !== commentId)

    // If we were editing this comment, cancel editing
    if (editingCommentId.value === commentId) {
      cancelEdit()
    }
  } catch (error) {
    console.error('Error during comment deletion process:', error)
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
