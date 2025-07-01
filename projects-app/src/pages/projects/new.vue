<template>
  <div class="container px-4 py-8 mx-auto">
    <h1 class="mb-6 text-3xl font-bold text-blue-600 dark:text-blue-400">Create New Project</h1>

    <div v-if="!authStore.isProjectManager" class="p-4 bg-red-100 border border-red-300 rounded-lg">
      <h2 class="font-bold text-red-700">Access Denied</h2>
      <p class="text-red-600">You don't have permission to create projects.</p>
      <router-link to="/projects" class="inline-block mt-2 text-blue-600 hover:underline">
        Return to Projects
      </router-link>
    </div>

    <div v-else class="max-w-2xl mx-auto">
      <div class="p-6 border rounded-lg bg-background">
        <h2 class="mb-4 text-xl font-bold">Project Details</h2>
        <p class="mb-6 text-muted-foreground">
          This page is only accessible to project managers and admins.
        </p>

        <form @submit.prevent class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium" for="name"> Project Name </label>
            <input
              id="name"
              type="text"
              class="w-full px-4 py-2 border rounded-md"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium" for="description"> Description </label>
            <textarea
              id="description"
              class="w-full px-4 py-2 border rounded-md"
              rows="4"
              placeholder="Enter project description"
            ></textarea>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium" for="dueDate"> Due Date </label>
            <input id="dueDate" type="date" class="w-full px-4 py-2 border rounded-md" />
          </div>

          <div class="flex justify-end pt-4 space-x-3">
            <router-link to="/projects" class="px-4 py-2 border rounded-md hover:bg-muted">
              Cancel
            </router-link>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Ensure roles are loaded
onMounted(async () => {
  if (authStore.user && (!authStore.userRoles || authStore.userRoles.length === 0)) {
    await authStore.loadUserRoles()
  }
})
</script>
