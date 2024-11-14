<template>
  <div class="notes">
    <h1>Notes</h1>
    <div class="card">
      <!-- User Selection Dropdown -->
      <div class="field">
        <label for="userSelect">Select User</label>
        <select v-model="selectedUserId" class="select" id="userSelect">
          <option value="" disabled>Select a user</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>
      <!-- Title and Content Fields for Note -->
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
      <div class="field grouped-right">
        <button
          class="button"
          @click="addNote"
          :disabled="!newNote || !newTitle || !selectedUserId"
        >
          Add New Note
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Define Note type
interface Note {
  content: string
  title: string
  id: string
  userId: string
  tags: string[]
}

// Props to receive users from App.vue
const props = defineProps<{ users: Array<{ id: string; name: string; email: string }> }>()

// Reactive variables
const notes = ref<Note[]>([])
const newNote = ref('')
const newTitle = ref('')
const selectedUserId = ref<string | null>(null) // Track selected user ID

// Constants for localStorage key
const NOTES_STORAGE_KEY = 'notes'

// Function to load notes from localStorage
const loadNotesFromLocalStorage = () => {
  const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY)
  if (storedNotes) {
    notes.value = JSON.parse(storedNotes)
  }
}

// Function to save notes to localStorage
const saveNotesToLocalStorage = () => {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes.value))
}

// Function to add a new note
const addNote = () => {
  if (newNote.value && newTitle.value && selectedUserId.value) {
    notes.value.push({
      content: newNote.value,
      title: newTitle.value,
      id: crypto.randomUUID(),
      userId: selectedUserId.value,
      tags: []
    })
    // Save notes to localStorage after adding a new note
    saveNotesToLocalStorage()

    // Clear form fields after adding note
    newNote.value = ''
    newTitle.value = ''
    selectedUserId.value = null
  }
}

// Get the route and check for userId in query
const route = useRoute()
onMounted(() => {
  loadNotesFromLocalStorage() // Load notes when component mounts

  // Check if userId is provided in the query and set it as the selected user
  if (route.query.userId) {
    selectedUserId.value = route.query.userId as string
  }
})
</script>
