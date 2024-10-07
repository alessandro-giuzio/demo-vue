<template>
  <div class="card">
    <!-- Content of each note displayed inside the card -->
    <div class="card-content">
      <div class="content">{{ note?.content }}</div>
    </div>

    <!-- Footer with Edit and Delete actions -->
    <footer class="card-footer">
      <a href="#" class="card-footer-item" @click.prevent="editNote">Edit</a>
      <a href="#" class="card-footer-item" @click.prevent="deleteNote">Delete</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Imports

// Define the Note Type
type Note = {
  content: string
}
// Props to receive the note and its index from the parent component
const props = defineProps<{
  note: Note
  index: Number
}>()

//Emits events to notify the parent component of actions (edit & delete)
const emit = defineEmits(['edit-note', 'delete-note'])

//Methods to edit and delete notes
const editNote = () => {
  emit('edit-note', props.index)
}
const deleteNote = () => {
  emit('delete-note', props.index)
}
</script>
