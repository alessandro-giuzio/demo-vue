<template>
  <div class="card">
    <div class="card-content">
      <div v-if="isEditing">
        <textarea v-model="editedContent" class="content"></textarea>
        <button @click="saveNote">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
      <details>
        <summary>More Info</summary>
        <p><strong>ID:</strong> {{ note?.id }}</p>
        <p><strong>Title:</strong> {{ note?.title }}</p>
        <p><strong>Tags:</strong> {{ note?.tags }}</p>
      </details>
      <!-- <div v-else class="content">{{ note?.content }}</div> -->
    </div>
    <footer class="card-footer">
      <a href="#" class="card-footer-item" @click.prevent="editNote">Edit</a>
      <a href="#" class="card-footer-item" @click.prevent="deleteNote">Delete</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Note = {
  id: string
  title: string
  content: string
  tags: string[]
}

const props = defineProps<{
  note: Note
  index: number
}>()

const emit = defineEmits(['edit-note', 'delete-note'])

const isEditing = ref(false)
const editedContent = ref(props.note.content)

const editNote = () => {
  isEditing.value = true
}

const saveNote = () => {
  emit('edit-note', { index: props.index, content: editedContent.value }) // Emit both index and edited content
  isEditing.value = false
}

const cancelEdit = () => {
  editedContent.value = props.note.content // reset to original content
  isEditing.value = false
}

const deleteNote = () => {
  emit('delete-note', props.index)
}
</script>

<style scoped>
.content {
  white-space: pre-wrap;
  padding: 0.75rem;
  border-radius: 4px;
  background-color: white;
}

.card {
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
