<template>
  <!-- Form to add a new note, with preventDefault behavior to avoid page reload -->
  <form @submit.prevent="submitNote" class="note-form">
    <!-- Input for the title -->
    <div class="form-group">
      <label for="title">Title:</label>
      <input type="text" v-model="newTitle" placeholder="Enter the title" />
    </div>
    <!-- Textarea for the content -->
    <div class="form-group">
      <label for="content">Content:</label>
      <textarea v-model="newContent" placeholder="Enter the content"></textarea>
    </div>
    <!-- Input for the tags, comma-separated -->
    <div class="form-group">
      <label for="tags">Tags (comma-separated):</label>
      <input type="text" v-model="newTags" placeholder="Enter tags" />
    </div>

    <!-- Submit button, disabled if title or content is empty -->
    <button :disabled="!newTitle || !newContent" type="submit">Save</button>
  </form>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// Ref for storing the new note input
const newTitle = ref('')
const newContent = ref('')
const newTags = ref('')

// Emits the 'add-note' event to the parent component
const emit = defineEmits(['add-note'])

// Function to submit the note and emit the event
const submitNote = () => {
  if (newTitle.value && newContent.value) {
    // Split the tags string into an array, trimming whitespace
    const tagsArray = newTags.value.split(',').map((tag) => tag.trim())

    // Emit the new note with title, content, and tags to the parent component
    emit('add-note', { title: newTitle.value, content: newContent.value, tags: tagsArray })

    // Clear the input fields after submission
    newTitle.value = ''
    newContent.value = ''
    newTags.value = ''
  }
}
</script>

<style scoped>
/* Style for the form container */
.note-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Style for form groups */
.form-group {
  display: flex;
  flex-direction: column;
}

/* Style for the input fields */
input[type='text'],
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: #fff;
  transition: border-color 0.3s ease;
}

/* Focus style for inputs */
input[type='text']:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
}

/* Style for the textarea */
textarea {
  resize: vertical;
  min-height: 100px;
}

/* Style for the submit button */
.btn-submit {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

/* Disable button styling */
.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Button hover state */
.btn-submit:not(:disabled):hover {
  background-color: #0056b3;
}

/* Label styling */
label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Padding around input and button elements */
input,
textarea,
button {
  margin-top: 0.25rem;
}
</style>
