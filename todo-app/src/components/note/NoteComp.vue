<template>
  <div class="card">
    <div class="user-id"><strong>User ID:</strong> {{ note.id }}</div>
    <div class="card-content">
      <div class="title">{{ note.title }}</div>
      <div class="content">
        {{ note.content }}
      </div>
    </div>
    <footer class="card-footer">
      <a href="#" class="card-footer-item" @click.prevent="handleEditClick(index)">Edit</a>
      <a href="#" class="card-footer-item" @click.prevent="handleDeleteClick(index)">Delete</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Define the Note Type
type Note = {
  id: string
  title: string
  content: string
  tags: string[]
}
// Props to receive the note and its index from the parent component
const props = defineProps<{
  note: Note
  index: number
}>()

// Emits events to notify the parent component of actions (edit & delete)
const emit = defineEmits(['edit-click', 'delete-click'])

const handleDeleteClick = (index: number) => {
  // Emit the 'delete-note' event with the index of the note to delete
  emit('delete-click', index)
}
const handleEditClick = (index: number) => {
  // Emit the 'edit-note' event with the index of the note to edit
  emit('edit-click', index)
}
</script>
