<template>
  <div class="notes">
    <h1>Notes</h1>
    <div class="card">
      <div class="field">
        <textarea
          ref="newNoteRef"
          v-model="newNote"
          class="textarea"
          placeholder="Add a new note"
        ></textarea>
      </div>

      <div class="field grouped-right">
        <button class="button" @click="addNote" :disabled="!newNote">Add New Note</button>
      </div>
    </div>
    <NoteComp
      v-for="(note, index) in notes"
      :key="note.id"
      :note="note"
      :index="index"
      @edit-click="editNote"
      @delete-click="deleteNote"
    />
    <!--  <div class="card" v-for="(note, index) in notes" :key="index">
      <div class="card-content">
        <div class="content">
          {{ note.content }}
        </div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item" @click.prevent="editNote(index)">Edit</a>
        <a href="#" class="card-footer-item" @click.prevent="deleteNote(index)">Delete</a>
      </footer>
    </div> -->
  </div>
</template>

<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import NoteComp from '@/components/note/NoteComp.vue'
// Define the Note Type with UUID
type Note = {
  content: string
  id: string // Ensure id is always a string
  title: string
  tags: string[]
}

// Reactive array of notes (loaded from localStorage or default value)
const notes = ref<Note[]>([])

// LocalStorage Key
const STORAGE_Key = 'notes'

// Reactive variable for the new note
const newNote = ref('')

// Reference to the new note textarea
const newNoteRef = ref<HTMLTextAreaElement | null>(null)

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

// Add a new note
const addNote = () => {
  if (newNote.value.trim()) {
    // Add the note to the beginning of the array
    notes.value.unshift({
      content: newNote.value,
      id: crypto.randomUUID(),
      title: '',
      tags: []
    })

    newNote.value = '' // Clear the input
    saveNotes() // Save the updated notes array to localStorage
    newNoteRef.value?.focus() // Focus the input after adding a note
  }
}

// Edit a note
const editNote = (index: number) => {
  newNote.value = notes.value[index].content // Load the note content into the input for editing
  deleteNote(index) // Delete the note so it can be replaced when saved
}

// Delete a note
const deleteNote = (index: number) => {
  notes.value.splice(index, 1)
  saveNotes() // Update localStorage after deletion
}

// Call the function to load notes on component mount
// Load notes when the component is mounted
onMounted(() => {
  loadNotes()
  // Log all notes and their IDs when the component mounts
  console.log('Notes loaded from localStorage:')
  notes.value.forEach((note) => {
    const tags = note.tags ? note.tags.join(', ') : 'No tags' // Handle undefined tags
    console.log(`ID: ${note.id}, Title: ${note.title}, Content: ${note.content}, Tags: ${tags}`)
  })
})
</script>

<style>
.card {
  background-color: #22543d; /* Dark green background */
  padding: 1rem;
  margin-bottom: 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 1rem;
}

.textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  resize: vertical;
  box-sizing: border-box;
  font-size: 1rem;
}

.grouped-right {
  display: flex;
  justify-content: flex-end;
}

.button {
  background-color: #38a169; /* Success color */
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2f855a;
}

.button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.card-content {
  padding: 1rem;
}

.content {
  font-size: 1rem;
  color: white;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-top: 1px solid #e2e8f0;
}

.card-footer-item {
  color: #3182ce;
  text-decoration: none;
  padding: 0.5rem;
}

.card-footer-item:hover {
  color: #2b6cb0;
}
</style>
