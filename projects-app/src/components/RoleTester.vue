<template>
  <div class="role-tester p-4 border rounded-lg bg-background">
    <h2 class="text-lg font-bold mb-4">Role-Based UI Testing</h2>

    <!-- Current roles display -->
    <div class="mb-4 p-3 border rounded-lg">
      <h3 class="font-medium mb-2">Your Current Roles</h3>
      <div v-if="authStore.userRoles?.length" class="flex flex-wrap gap-2">
        <span
          v-for="role in authStore.userRoles"
          :key="role.id"
          class="px-2 py-1 text-xs rounded-full font-medium"
          :class="{
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': role.key === 'admin',
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
              role.key === 'project_manager',
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300':
              role.key === 'contributor'
          }"
        >
          {{ role.key }}
        </span>
      </div>
      <p v-else class="text-sm text-muted-foreground">No roles assigned</p>

      <!-- Debug information -->
      <div class="mt-2 text-xs text-muted-foreground">
        <div>User authenticated: {{ authStore.user ? '✅' : '❌' }}</div>
        <div>Roles loaded: {{ authStore.userRoles?.length ? '✅' : '❌' }}</div>
        <button
          @click="reloadRoles"
          class="mt-1 px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded"
        >
          Reload Roles
        </button>
      </div>
    </div>

    <!-- Role-specific UI elements -->
    <div class="grid gap-4">
      <!-- Admin only section -->
      <div v-if="authStore.isAdmin" class="p-3 border rounded-lg bg-red-50 dark:bg-red-900/10">
        <h3 class="font-medium text-red-800 dark:text-red-400">Admin Only</h3>
        <p class="text-sm text-muted-foreground">This section is only visible to administrators.</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <button class="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
            Delete Project
          </button>
          <button class="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
            Ban User
          </button>
        </div>
      </div>

      <!-- Project Manager section -->
      <div
        v-if="authStore.isProjectManager"
        class="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/10"
      >
        <h3 class="font-medium text-blue-800 dark:text-blue-400">Project Manager</h3>
        <p class="text-sm text-muted-foreground">
          This section is visible to project managers and admins.
        </p>
        <div class="mt-2 flex flex-wrap gap-2">
          <button class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Create Project
          </button>
          <button class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Assign Tasks
          </button>
        </div>
      </div>

      <!-- Contributor section -->
      <div
        v-if="authStore.isContributor"
        class="p-3 border rounded-lg bg-green-50 dark:bg-green-900/10"
      >
        <h3 class="font-medium text-green-800 dark:text-green-400">Contributor</h3>
        <p class="text-sm text-muted-foreground">
          This section is visible to contributors, project managers, and admins.
        </p>
        <div class="mt-2 flex flex-wrap gap-2">
          <button class="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">
            Update Task Status
          </button>
        </div>
      </div>

      <!-- Everyone section -->
      <div class="p-3 border rounded-lg">
        <h3 class="font-medium">Everyone</h3>
        <p class="text-sm text-muted-foreground">
          This section is visible to all authenticated users.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Ensure roles are loaded when component mounts
onMounted(async () => {
  if (authStore.user && (!authStore.userRoles || authStore.userRoles.length === 0)) {
    await authStore.loadUserRoles()
  }
})

// Function to manually reload roles
const reloadRoles = async () => {
  if (authStore.user) {
    await authStore.loadUserRoles()
  }
}
</script>
