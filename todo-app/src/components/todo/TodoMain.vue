<template>
  <div class="todo-container">
    <section class="todo-form">
      <TodoForm :current-note="currentNote" @save-note="saveNote" />
    </section>
    <section class="todo-list">
      <h2>Notes</h2>
      <TodoList :notes="notes" @edit-note="setCurrentNoteForEdit" @delete-note="deleteNote" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import TodoForm from './TodoForm.vue'
import TodoList from './TodoList.vue'

type Note = {
  id: string | null
  title: string
  content: string
  tags: string[]
}

const STORAGE_Key = 'notes'
const notes = ref<Note[]>([])
const currentNote = ref<Note>({ id: null, title: '', content: '', tags: [] })

// Load notes from localStorage
const loadNotes = () => {
  const notesFromStorage = localStorage.getItem(STORAGE_Key)
  if (notesFromStorage) {
    notes.value = JSON.parse(notesFromStorage)
  }
}

onMounted(() => {
  loadNotes()
})

// Save notes to localStorage
watch(
  notes,
  () => {
    localStorage.setItem(STORAGE_Key, JSON.stringify(notes.value))
  },
  { deep: true }
)

// Save a new or edited note
const saveNote = (note: Note) => {
  if (note.id) {
    const index = notes.value.findIndex((n) => n.id === note.id)
    if (index !== -1) notes.value[index] = { ...note }
  } else {
    notes.value.push({ ...note, id: crypto.randomUUID() })
  }
  resetCurrentNote()
}

// Set the current note for editing
const setCurrentNoteForEdit = (note: Note) => {
  currentNote.value = { ...note }
}

// Reset the current note to prepare for a new note
const resetCurrentNote = () => {
  currentNote.value = { id: null, title: '', content: '', tags: [] }
}

// Delete a note by ID
const deleteNote = (id: string) => {
  notes.value = notes.value.filter((note) => note.id !== id)
}
</script>
<style scoped>
.todo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f0f4f8;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.todo-form,
.todo-list {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.todo-list h2 {
  text-align: center;
  font-weight: 700;
  color: #333;
}

@media (max-width: 600px) {
  .todo-container {
    padding: 1rem;
  }
}
</style>
