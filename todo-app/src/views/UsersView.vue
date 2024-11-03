<template>
  <div>
    <h1>Users Page</h1>
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">User List</h1>
      <div v-if="users.length">
        <ul>
          <li v-for="user in users" :key="user.id" class="mb-2">
            <p><strong>ID:</strong> {{ user.id }}</p>
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  users: Array<{ id: string; name: string; email: string; password: string }>
}>()
</script>
