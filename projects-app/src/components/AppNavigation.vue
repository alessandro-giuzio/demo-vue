<template>
  <nav class="bg-background border-b dark:border-gray-700">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap items-center justify-between py-4">
        <div class="flex items-center">
          <router-link to="/" class="font-bold text-xl">Projects App</router-link>
        </div>

        <div class="hidden md:flex space-x-8">
          <!-- Always visible links -->
          <router-link to="/dashboard" class="text-muted-foreground hover:text-foreground">
            Dashboard
          </router-link>
          <router-link to="/projects" class="text-muted-foreground hover:text-foreground">
            Projects
          </router-link>
          <router-link to="/tasks" class="text-muted-foreground hover:text-foreground">
            Tasks
          </router-link>

          <!-- Project Manager & Admin links -->
          <router-link
            v-if="authStore.isProjectManager"
            to="/projects/new"
            class="text-blue-600 dark:text-blue-400 hover:underline"
          >
            New Project
          </router-link>

          <!-- Admin only links -->
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            class="text-red-600 dark:text-red-400 hover:underline"
          >
            Admin Panel
          </router-link>
        </div>

        <div class="flex items-center">
          <div v-if="authStore.user" class="relative group">
            <button class="flex items-center space-x-1 focus:outline-none">
              <span class="text-sm">{{ authStore.user.email }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <div
              class="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg hidden group-hover:block z-10"
            >
              <div class="py-1">
                <router-link to="/profile" class="block px-4 py-2 text-sm hover:bg-muted">
                  Profile
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <router-link
            v-else
            to="/login"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Login
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Load roles when component mounts
onMounted(async () => {
  if (authStore.user && (!authStore.userRoles || authStore.userRoles.length === 0)) {
    await authStore.loadUserRoles()
  }
})

// Logout function
const logout = async () => {
  try {
    // Assuming you have a logout function in your auth store
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
