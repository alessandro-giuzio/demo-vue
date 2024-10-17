<template>
  <div class="todo-list">
    <TodoForm @add-note="addNote" />
    <TodoList :notes="notes" @edit-note="updateNote" @delete-note="deleteNote" />
  </div>
</template>

<script setup lang="ts">
// imports
import { ref, onMounted, watch } from 'vue'
import TodoForm from './TodoForm.vue'
import TodoList from './TodoList.vue'

// Define the Note Type with UUID
type Note = {
  content: string
  id: string // Add a unique ID to each note
  title: string
  tags: string[]
}
// Reactive array of notes (loaded from localStorage or default value)
const notes = ref<Note[]>([])

// LocalStorage Key
const STORAGE_Key = 'notes'

// Current note being edited
/* const currentNoteContent = ref('')
let currentNoteIndex = ref<number | null>(null) */

// Load notes from localStorage
const loadNotes = () => {
  const notesFromStorage = localStorage.getItem(STORAGE_Key)
  if (notesFromStorage) {
    notes.value = JSON.parse(notesFromStorage)
  }
}
// Save notes to localStorage
const saveNotes = () => {
  localStorage.setItem(STORAGE_Key, JSON.stringify(notes.value))
}
// Watch for changes in the notes array and save them to localStorage
watch(
  notes,
  () => {
    saveNotes()
  },
  { deep: true }
)
// Load notes when the component is mounted
onMounted(() => {
  loadNotes()
  // Log all notes and their IDs when the component mounts
  console.log('Notes loaded from localStorage:')
  notes.value.forEach((note) => {
    console.log(`ID: ${note.id}, Content: ${note.content}`)
  })
})
// Methods to add, edit, and delete notes
const addNote = (newNoteContent: string) => {
  const note = {
    id: crypto.randomUUID(), // Generate a unique ID for the note
    content: newNoteContent
  }
  notes.value.unshift(note)
}
const updateNote = ({ index, content }: { index: number; content: string }) => {
  console.log('Updating note at index:', index, 'with content:', content)

  if (notes.value[index]) {
    notes.value[index].content = content // Update the note content
  } else {
    console.error('Note not found at index:', index)
  }
}

const deleteNote = (index: number) => {
  notes.value.splice(index, 1)
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
