<template>
  <div class="card">
    <RouterLink :to="`/todo-detail/${note.id}`">View Details</RouterLink>
    <div class="card-content">
      <div class="content">{{ note.content }}</div>
    </div>
    <footer class="card-footer">
      <a href="#" class="card-footer-item" @click.prevent="editNote">Edit</a>
      <a href="#" class="card-footer-item" @click.prevent="deleteNote">Delete</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
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

// Emit the full note for editing in the parent component
const editNote = () => {
  emit('edit-note', props.note)
}

// Emit the note’s ID for deletion
const deleteNote = () => {
  emit('delete-note', props.note.id)
}
</script>
