<template>
  <!-- Loop through the `notes` array and display each note -->
  <TodoListItem
    v-for="(note, index) in notes"
    :key="index"
    :note="note"
    :index="index"
    @edit-note="editNote"
    @delete-note="deleteNote"
  />
</template>

<script setup lang="ts">
// Imports
import TodoListItem from './TodoListItem.vue'

// Define the Note Type
type Note = {
  id: string
  title: string
  content: string
  tags: string[]
}

// Props to receive the notes array from the parent component
const props = defineProps<{
  notes: Note[]
}>()

// Emits events to notify the parent component of actions (edit & delete)
const emit = defineEmits(['edit-note', 'delete-note'])

//Methods to edit and delete notes
const editNote = ({ index, content }: { index: number; content: string }) => {
  emit('edit-note', { index, content })
}

const deleteNote = (index: number) => {
  emit('delete-note', index)
}
</script>
