<template>
  <h1>Projects Page</h1>
  <RouterLink to="/">Home</RouterLink>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'

let projects
;(async () => {
  const { data, error } = await supabase.from('projects').select('*')
  if (error) console.log(error)
  projects = data
  console.log('projects:', projects)
})()
</script>
