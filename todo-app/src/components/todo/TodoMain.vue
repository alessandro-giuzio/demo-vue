<template>
  <div class="todo-list">
    <TodoForm @add-note="addNote" />
    <TodoList :notes="notes" @edit-note="openEditModal" @delete-note="deleteNote" />
    <!-- ModalEdit component -->
    <ModalEdit
      v-if="modals.editNote"
      :modelValue="modals.editNote"
      :noteContent="currentNoteContent"
      @update:model-value="closeEditModal"
    />
  </div>
</template>

<script setup lang="ts">
// imports
import { ref, reactive, onMounted, watch } from 'vue'
import TodoForm from './TodoForm.vue'
import TodoList from './TodoList.vue'
import ModalEdit from './ModalEdit.vue'

// Define the Note Type
type Note = {
  content: string
}
// Reactive array of notes (loaded from localStorage or default value)
const notes = ref<Note[]>([])

// LocalStorage Key
const STORAGE_Key = 'notes'

// Current note being edited
const currentNoteContent = ref('')
let currentNoteIndex = ref<number | null>(null)

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
})
// Methods to add, edit, and delete notes
const addNote = (newNoteContent: string) => {
  const note = { content: newNoteContent }
  notes.value.unshift(note)
}
const openEditModal = (index: number) => {
  // Set the content of the note being edited into `currentNoteContent`
  // The `index` passed to the function helps identify which note to edit.
  currentNoteContent.value = notes.value[index].content
  // Store the index of the note being edited in `currentNoteIndex`
  // This index will be used later when saving the edited note.
  currentNoteIndex.value = index
  modals.editNote = true
}
const closeEditModal = () => {
  modals.editNote = false
}
const deleteNote = (index: number) => {
  notes.value.splice(index, 1)
}
// modals
// Create a reactive object to track the state of modals in the application
const modals = reactive({
  // The 'editNote' property controls the visibility of the edit modal
  // Initially, the modal is not visible (editNote is set to false)
  editNote: false
})
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
