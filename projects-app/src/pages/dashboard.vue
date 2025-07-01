<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <div class="grid gap-6">
      <div v-if="authStore.user">
        <div class="p-4 border rounded-lg bg-muted/30 mb-6">
          <h2 class="text-xl font-bold mb-2">Welcome, {{ authStore.user.email }}</h2>
          <p class="text-muted-foreground">You are currently logged in with the following roles:</p>
        </div>

        <!-- Include the RoleTester component -->
        <RoleTester />
      </div>
      <div v-else class="p-4 border rounded-lg bg-muted/30">
        <h2 class="text-xl font-semibold mb-2">Not logged in</h2>
        <p class="text-muted-foreground mb-4">Please log in to see your dashboard.</p>
        <button
          @click="router.push('/login')"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Log In
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RoleTester from '@/components/RoleTester.vue'

const router = useRouter()
const authStore = useAuthStore()
</script>
