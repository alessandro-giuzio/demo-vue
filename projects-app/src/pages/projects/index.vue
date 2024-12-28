<template>
  <h1>Projects Page</h1>
  <ul>
    <li v-for="project in projects" :key="project.id">
      {{ project.name }}
    </li>
  </ul>
  <RouterLink to="/">Home</RouterLink>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { ref } from 'vue'
import type { Tables } from '../../../database/types'

const projects = ref<Tables<'projects'>[] | null>(null)
;(async () => {
  const { data, error } = await supabase.from('projects').select('*')
  if (error) console.log(error)
  projects.value = data
  console.log('projects:', projects.value)
})()
</script>
