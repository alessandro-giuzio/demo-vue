<template>
  <div class="card">
    <div class="user-id"><strong>User:</strong> {{ userName }}</div>
    <div class="card-content">
      <div class="title">Title: {{ note.title }}</div>
      <div class="content">Content: {{ note.content }}</div>
      <div class="tags">
        <strong>Tags:</strong>
        <span v-if="note.tags && note.tags.length > 0">
          <span class="tag" v-for="tag in note.tags" :key="tag">{{ tag }}</span>
        </span>
        <span v-else>No tags available</span>
      </div>
    </div>

    <div class="share" v-if="!readOnly">
      <form @submit.prevent="handleShareClick">
        <fieldset>
          <legend>Users</legend>
          <section class="share-note-users">
            <h3>Select users to share your note with:</h3>
            <ul>
              <li v-for="user in filteredUsers" :key="user.id">
                <input
                  type="checkbox"
                  :id="user.id"
                  :value="user.id"
                  v-model="selectedSharedUsers"
                  :disabled="user.id === loggedInUser?.id"
                />
                <label :for="user.id">{{ user.name }}</label>
              </li>
            </ul>
          </section>
          <button class="button" type="submit">Share</button>
        </fieldset>
      </form>
    </div>
    <footer class="card-footer" v-if="!readOnly">
      <a href="#" class="card-footer-item" @click.prevent="handleEditClick(index)">Edit</a>
      <a href="#" class="card-footer-item" @click.prevent="handleDeleteClick(index)">Delete</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Define the Note Type
type Note = {
  id: string
  title: string
  content: string
  tags: string[]
  userId: string
  sharedWith: string[] // Array of users with only read access
}
// Define the User Type
type User = {
  id: string
  name: string
  email: string
  password: string
}
// Props to receive the note and its index from the parent component
const props = defineProps<{
  note: Note
  index: number
  users: User[]
  loggedInUser: User // Add loggedInUser prop
  readOnly?: boolean // Add readOnly prop
}>()

const sharedWith = ref<string[]>([])
const selectedSharedUsers = ref<string[]>([])

// Filter the users to exclude the user associated with the note
const filteredUsers = computed(() => {
  return props.users.filter((user) => user.id !== props.note.userId)
})

// Compute the username by finding the user associated with the note's userId
const userName = computed(() => {
  const user = props.users.find((user) => user.id === props.note.userId)
  console.log('User:', user) // Debugging: Log user
  return user ? user.name : 'Unknown User'
})

// Emits events to notify the parent component of actions (edit & delete)
const emit = defineEmits(['edit-click', 'delete-click', 'share-note'])

const handleDeleteClick = (index: number) => {
  // Emit the 'delete-note' event with the index of the note to delete
  emit('delete-click', index)
}
const handleEditClick = (index: number) => {
  // Emit the 'edit-note' event with the index of the note to edit
  emit('edit-click', index)
}
const handleShareClick = () => {
  // Emit the 'share-note' event with the note id and selected shared users
  emit('share-note', { noteId: props.note.id, sharedWith: selectedSharedUsers.value })
  // Update the sharedWith property of the note
  sharedWith.value = selectedSharedUsers.value
}
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
