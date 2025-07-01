<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { fetchUserProjectsQuery } from '@/utils/supaQueries'
import ProjectCard from '../../components/projects/ProjectCard.vue'
import { showError } from '@/utils/toast'

const route = useRoute()
const username = route.params.username as string
const projects = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const user = ref<any>(null)

onMounted(async () => {
  try {
    loading.value = true

    // First, get the user ID from the username
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, full_name, avatar_url, username')
      .eq('username', username)
      .single()

    if (userError) {
      console.error('Error fetching user:', userError)
      error.value = `Error fetching user: ${userError.message}`
      return
    }

    user.value = userData

    // Now fetch all projects for this user
    const userProjects = await fetchUserProjectsQuery(userData.id)
    projects.value = userProjects

    console.log(`Loaded ${projects.value.length} projects for ${username}`)
  } catch (err) {
    console.error('Error loading projects:', err)
    error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    showError('Failed to load user projects')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container px-4 py-8 mx-auto">
    <div v-if="user" class="flex items-center gap-4 mb-8">
      <div class="w-16 h-16 overflow-hidden rounded-full">
        <img
          v-if="user.avatar_url"
          :src="user.avatar_url"
          :alt="user.username"
          class="object-cover w-full h-full"
        />
        <div
          v-else
          class="flex items-center justify-center w-full h-full bg-muted text-muted-foreground"
        >
          {{ user.username?.charAt(0).toUpperCase() }}
        </div>
      </div>
      <div>
        <h1 class="text-2xl font-bold">{{ user.full_name || user.username }}</h1>
        <p class="text-muted-foreground">@{{ user.username }}</p>
      </div>
    </div>

    <h2 class="mb-4 text-xl font-bold">Projects</h2>

    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="w-8 h-8 border-4 rounded-full animate-spin border-primary border-t-transparent"
      ></div>
    </div>

    <div v-else-if="error" class="p-4 border rounded-md bg-destructive/15 border-destructive">
      <p class="text-destructive">{{ error }}</p>
    </div>

    <div v-else-if="projects.length === 0" class="p-8 text-center border rounded-md bg-muted/20">
      <p class="text-muted-foreground">No projects found for this user.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :show-role="true"
      />
    </div>
  </div>
</template>
