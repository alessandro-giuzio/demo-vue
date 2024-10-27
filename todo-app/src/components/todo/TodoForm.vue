<template>
  <form @submit.prevent="submitNote" class="note-form">
    <div class="form-group">
      <label for="title">Title:</label>
      <input type="text" v-model="localNote.title" placeholder="Enter the title" required />
    </div>
    <div class="form-group">
      <label for="content">Content:</label>
      <textarea v-model="localNote.content" placeholder="Enter the content" required></textarea>
    </div>
    <div class="form-group">
      <label for="tags">Tags (comma-separated):</label>
      <input
        type="text"
        v-model="tagsInput"
        placeholder="Enter tags"
        title="Tags (comma-separated)"
      />
    </div>
    <button
      :disabled="!localNote.title || !localNote.content"
      type="submit"
      :class="['btn-submit', localNote.id ? 'edit-mode' : 'save-mode']"
    >
      {{ localNote.id ? 'Edit' : 'Save' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

// Define props
const props = defineProps({
  currentNote: {
    type: Object,
    required: true
  }
})

// Define emits
const emit = defineEmits(['save-note'])

// Create a local reactive copy of currentNote to avoid mutating props
const localNote = reactive({
  id: props.currentNote.id,
  title: props.currentNote.title,
  content: props.currentNote.content,
  tags: [...(props.currentNote.tags || [])] // Spread to avoid reference issues
})

// Reactive variable for tags input
const tagsInput = ref(localNote.tags.join(', '))

// Watch for changes in currentNote and update localNote accordingly
watch(
  () => props.currentNote,
  (newNote) => {
    localNote.id = newNote.id
    localNote.title = newNote.title
    localNote.content = newNote.content
    localNote.tags = [...(newNote.tags || [])]
    tagsInput.value = newNote.tags ? newNote.tags.join(', ') : ''
  },
  { immediate: true }
)

// Emit save-note with all data on submission
const submitNote = () => {
  const tagsArray = tagsInput.value.split(',').map((tag) => tag.trim())
  emit('save-note', { ...localNote, tags: tagsArray })
}
</script>

<style scoped>
.note-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-header {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

input[type='text'],
textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

input[type='text']:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
}

.btn-submit {
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-mode {
  background-color: #007bff;
}

.edit-mode {
  background-color: #28a745;
}

.btn-submit:hover {
  opacity: 0.9;
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
