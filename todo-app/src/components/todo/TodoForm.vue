<template>
  <!-- Form to add a new note, with preventDefault behavior to avoid page reload -->
  <form @submit.prevent="submitNote">
    <!-- Label for the textarea -->
    <label for="todo">Add a new todo:</label>

    <!-- v-model for two-way binding with the note input -->
    <textarea v-model="newNote" placeholder="Add a new note"></textarea>

    <!-- Submit button, disabled if `newNote` is empty -->
    <button :disabled="!newNote" type="submit">Add</button>
  </form>
</template>

<script setup lang="ts">
// imports
import { ref, defineEmits } from 'vue'

// Ref for storing the new note input
const newNote = ref('')

// Emits the 'add-note' event to the parent component
const emit = defineEmits(['add-note'])

// Function to submit the note and emit the event
const submitNote = () => {
  if (newNote.value) {
    emit('add-note', newNote.value) // Emit the note content to the parent
    newNote.value = '' // Clear the input after submission
  }
}
</script>
