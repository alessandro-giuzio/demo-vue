<template>
  <div class="container px-4 py-8 mx-auto">
    <h1 class="mb-6 text-3xl font-bold text-red-600 dark:text-red-400">Admin Panel</h1>

    <div v-if="!authStore.isAdmin" class="p-4 bg-red-100 border border-red-300 rounded-lg">
      <h2 class="font-bold text-red-700">Access Denied</h2>
      <p class="text-red-600">You don't have permission to access this page.</p>
      <router-link to="/dashboard" class="inline-block mt-2 text-blue-600 hover:underline">
        Return to Dashboard
      </router-link>
    </div>

    <div v-else class="grid gap-6">
      <!-- Role Management Section -->
      <div class="p-6 border rounded-lg bg-background">
        <RoleManager />
      </div>

      <!-- Dangerous Operations Section -->
      <div class="p-6 border rounded-lg bg-background">
        <h2 class="mb-4 text-xl font-bold">Admin Operations</h2>
        <p class="mb-6 text-muted-foreground">
          This section contains dangerous operations only accessible to administrators.
        </p>

        <div class="p-4 border rounded-lg bg-red-50 dark:bg-red-900/10">
          <h3 class="font-medium">Dangerous Operations</h3>
          <div class="flex flex-wrap gap-2 mt-2">
            <button class="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">
              Reset Database
            </button>
            <button class="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">
              Delete All Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import RoleManager from '@/components/RoleManager.vue'

const authStore = useAuthStore()

// Ensure roles are loaded
onMounted(async () => {
  if (authStore.user && (!authStore.userRoles || authStore.userRoles.length === 0)) {
    await authStore.loadUserRoles()
  }
})
</script>
