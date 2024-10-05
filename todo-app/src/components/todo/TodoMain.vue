<template>
  <div class="todo-list">
    <TodoForm @add-note="addNote" />

    <!-- Loop through the `notes` array and display each note -->
    <div class="card" v-for="(note, index) in notes" :key="index">
      <!-- Content of each note displayed inside the card -->
      <div class="card-content">
        <div class="content">{{ note.content }}</div>
      </div>

      <!-- Footer with Edit and Delete actions -->
      <footer class="card-footer">
        <a href="#" class="card-footer-item">Edit</a>
        <a href="#" class="card-footer-item">Delete</a>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
import TodoForm from './TodoForm.vue'

// data

const notes = ref([
  { content: 'Lorem ipsum dolor sit amet.' },
  { content: 'note 2' },
  { content: 'Sed do eiusmod tempor incididunt.' },
  { content: 'Ut labore et dolore magna aliqua.' },
  { content: 'Ut enim ad minim veniam.' }
])

const addNote = (newNoteContent: string) => {
  const note = { content: newNoteContent }
  notes.value.unshift(note)
}
</script>

<style>
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #f9f9f9;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
  width: 100%;
  margin-top: 2rem;
}
textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
}

button[type='submit'] {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button[type='submit']:hover {
  background-color: #0056b3;
}

.card {
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
  border: 1px solid #dddd;
}

.card-content {
  padding: 1rem;
  font-size: 1rem;
  color: black;
  font-weight: 800;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  background-color: #f1f1f1;
  border-top: 1px solid #ddd;
}

.card-footer-item {
  padding: 0.75rem 1rem;
  text-align: center;
  color: #007bff;
  cursor: pointer;
  transition: color 0.3s ease;
  flex-grow: 1;
  margin: 0 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.card-footer-item:hover {
  color: #0056b3;
}
</style>
