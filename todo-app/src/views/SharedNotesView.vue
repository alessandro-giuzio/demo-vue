<template>
  <div class="shared-notes" v-if="loggedInUser">
    <h1>Shared Tasks</h1>
    <ul>
      <li v-for="note in sharedNotes" :key="note.id">{{ note.title }}</li>
    </ul>
    <!-- show all the notes content -->

    <div v-if="sharedNotes.length > 0">
      <NoteComp
        v-for="(note, index) in sharedNotes"
        :key="note.id"
        :note="note"
        :index="index"
        :users="users"
        :loggedInUser="loggedInUser"
        :readOnly="true"
      />
    </div>
    <p v-else>No tasks have been shared with you.</p>
  </div>
  <p v-else class="error">You must be logged in to view shared notes.</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NoteComp from '@/components/note/NoteComp.vue'

// Define props
const props = defineProps<{
  users: User[]
  loggedInUser: User | null
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

// Define User Type
type User = {
  id: string
  name: string
  email: string
  password: string
}

// Reactive arrays for notes and users
const notes = ref<Note[]>([])
const users = ref<User[]>(props.users) // Initialize users with the prop value
const sharedNotes = ref<Note[]>([])
// LocalStorage Keys
const STORAGE_Key = 'notes'

// Load notes from localStorage
const loadNotes = () => {
  const notesFromStorage = localStorage.getItem(STORAGE_Key)
  if (notesFromStorage) {
    notes.value = JSON.parse(notesFromStorage)
    sharedNotes.value = notes.value.filter((note) =>
      note.sharedWith.includes(props.loggedInUser?.id || '')
    )
    console.log('Shared Notes:', sharedNotes.value) // Debugging: Log shared notes
  } else {
    console.log('No notes found in localStorage')
  }
}

// Call the function to load notes on component mount
onMounted(() => {
  loadNotes()
})
</script>

<style>
.shared-notes {
  padding: 1rem;
}

.error {
  color: red;
}
</style>
