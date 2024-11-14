<template>
  <div>
    <h1>Users Page</h1>
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">Users List</h1>
      <div v-if="users.length">
        <ul>
          <li v-for="user in sortedUsers" :key="user.id" class="grid">
            <p><strong>ID:</strong> {{ user.id }}</p>
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Password:</strong> {{ user.password }}</p>
            <RouterLink :to="{ name: 'create-note', query: { userId: user.id } }">
              Create New Note
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  users: Array<{ id: string; name: string; email: string; password: string }>
}>()

const sortedUsers = computed(() => {
  // Create a copy of the users array to avoid mutating the original array
  return [...props.users].sort((a, b) =>
    // Sort the copied array by user names using localeCompare for proper alphabetical order
    a.name.localeCompare(b.name)
  )
})
</script>
<style>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  border: 1px solid magenta;
  border-radius: 10px;
  padding: 1rem;
}
</style>
