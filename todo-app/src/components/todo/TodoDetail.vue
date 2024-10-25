<template>
  <div class="container">
    <h2>Todo Details Page</h2>
    <p>ID: {{ $route.params.id }}</p>
    <!-- Display note details if found -->
    <div v-if="note">
      <p><strong>Title:</strong> {{ note.title }}</p>
      <p><strong>Content:</strong> {{ note.content }}</p>
      <p><strong>Tags:</strong> {{ note.tags.join(', ') }}</p>
    </div>
    <!-- Show an error message if the note is not found -->
    <div v-else>
      <p>Note not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Array to store notes
const notes = ref([])

// Load notes from localStorage or any other source
const loadNotes = () => {
  const storedNotes = localStorage.getItem('notes')
  if (storedNotes) {
    notes.value = JSON.parse(storedNotes)
  }
}

// Get the route parameters
const route = useRoute()

// Load notes when the component mounts
onMounted(() => {
  loadNotes()
})

// Find the note based on the ID from the route params
const note = computed(() => {
  return notes.value.find((note) => note.id === route.params.id) || null
})
</script>
<style>
.container {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
}
</style>
