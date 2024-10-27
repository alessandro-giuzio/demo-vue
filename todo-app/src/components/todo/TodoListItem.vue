<template>
  <div class="card">
    <RouterLink class="router-link" :to="`/todo-detail/${note.id}`">View Details</RouterLink>
    <div class="card-content">
      <p class="title">Title: {{ note.title }}</p>
      <div class="content">Content: {{ note.content }}</div>
      <div class="tags">
        <span class="tag" v-for="tag in note.tags" :key="tag">{{ tag }}</span>
      </div>
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
<style>
.card {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}
.router-link {
  color: #007bff;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: color 0.3s ease;
}
.title {
  font-size: 1rem;
  font-weight: bold;
  color: blue;
}
.tag {
  margin-right: 0.5rem;
  color: black;
}
.content {
  color: black;
}
.card-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
