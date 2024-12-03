<template>
  <div class="notes" v-if="props.loggedInUser">
    <h1>Notes</h1>
    <div class="card">
      <div class="field">
        <input type="text" v-model="newTitle" class="textarea" placeholder="Add a title" />
      </div>
      <div class="field">
        <textarea
          ref="newNoteRef"
          v-model="newNote"
          class="textarea"
          placeholder="Add a new note"
        ></textarea>
      </div>
      <div class="field">
        <label for="tagsInput">Add Tags (comma-separated)</label>
        <input
          type="text"
          v-model="newTags"
          id="tagsInput"
          class="textarea"
          placeholder="Add tags"
        />
      </div>
      <div class="field grouped-right">
        <button class="button" @click="addNote" :disabled="!newNote || !newTitle">
          Add New Note
        </button>
      </div>
    </div>
    <NoteComp
      v-for="(note, index) in notes"
      :key="note.id"
      :note="note"
      :index="index"
      :users="users"
      @edit-click="editNote"
      @delete-click="deleteNote"
      :loggedInUser="props.loggedInUser"
      @share-note="handleShareNote"
    />
    <router-link to="/notes/shared">View Shared Notes</router-link>
  </div>
  <p v-else class="error">You must be logged in to create or view notes.</p>
</template>

<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import NoteComp from '@/components/note/NoteComp.vue'

// Props
const props = defineProps<{
  users: User[]
  loggedInUser: { id: string; name: string } | null
}>()

// Define the Note Type with UUID
type Note = {
  content: string
  id: string // Ensure id is always a string
  title: string
  tags: string[]
  userId: string
  sharedWith: string[] // Add sharedWith property
}
// Define User and Note Types
type User = {
  id: string
  name: string
  email: string
  password: string
}

// Reactive arrays for notes and users
const notes = ref<Note[]>([])
const users = ref<User[]>([])
// LocalStorage Keys
const STORAGE_Key = 'notes'
const USERS_Key = 'users'

// Reactive variables for the new note and title
const newNote = ref('')
const newTitle = ref('') // New title field
const newTags = ref('') // New tags field

// Track selected user ID
const editingIndex = ref<number | null>(null) // Track the index of the note being edited

// Reference to the new note textarea
const newNoteRef = ref<HTMLTextAreaElement | null>(null)

// Load notes from localStorage
const loadNotes = () => {
  const notesFromStorage = localStorage.getItem(STORAGE_Key)
  if (notesFromStorage) {
    notes.value = JSON.parse(notesFromStorage).filter(
      (note: Note) => note.userId === props.loggedInUser?.id
    )
  }
}

// Load users from localStorage
const loadUsers = () => {
  const usersFromStorage = localStorage.getItem(USERS_Key)
  if (usersFromStorage) {
    users.value = JSON.parse(usersFromStorage)
  }
}

// Save notes to localStorage
const saveNotes = () => {
  localStorage.setItem(STORAGE_Key, JSON.stringify(notes.value))
}

// Add a new note associated with the selected user
const addNote = () => {
  if (newNote.value.trim() && newTitle.value.trim() && props.loggedInUser) {
    if (editingIndex.value !== null) {
      // Update the existing note
      notes.value[editingIndex.value] = {
        ...notes.value[editingIndex.value],
        content: newNote.value,
        title: newTitle.value,
        tags: newTags.value.split(',').map((tag) => tag.trim()),
        userId: props.loggedInUser.id // Use loggedInUser for assignment
      }
      editingIndex.value = null // Clear the editing index
    } else {
      // Add a new note
      notes.value.unshift({
        content: newNote.value,
        title: newTitle.value,
        id: crypto.randomUUID(),
        tags: newTags.value.split(',').map((tag) => tag.trim()),
        userId: props.loggedInUser.id, // Use loggedInUser for assignment
        sharedWith: [] // Initialize sharedWith as an empty array
      })
    }

    // Clear the form fields
    newNote.value = ''
    newTitle.value = ''
    newTags.value = ''

    saveNotes() // Save the updated notes array to localStorage
    newNoteRef.value?.focus() // Focus the note input after saving
  } else {
    console.error('Failed to create note: Missing title, content, or user.')
  }
}

// Edit a note
const editNote = (index: number) => {
  const note = notes.value[index]
  newNote.value = note.content // Load the note content into the input for editing
  newTitle.value = note.title // Load the note title for editing
  editingIndex.value = index // Set the index of the note being edited
}

// Delete a note
const deleteNote = (index: number) => {
  notes.value.splice(index, 1)
  saveNotes() // Update localStorage after deletion
}

const handleShareNote = ({ noteId, sharedWith }) => {
  const note = notes.value.find((note) => note.id === noteId)
  if (note) {
    note.sharedWith = sharedWith
    saveNotes() // Save the updated notes array to localStorage
  }
}

// Call the function to load notes on component mount
onMounted(() => {
  loadNotes()
  loadUsers()
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
