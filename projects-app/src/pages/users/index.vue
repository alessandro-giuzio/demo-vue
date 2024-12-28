<template>
  <main>
    <h1>Users Page</h1>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.username }}
      </li>
    </ul>
    <RouterLink to="/">Home</RouterLink>
  </main>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { ref } from 'vue'
import type { Tables } from '../../../database/types'

const users = ref<Tables<'users'>[] | null>(null)
;(async () => {
  const { data, error } = await supabase.from('users').select('*')
  if (error) console.log(error)
  users.value = data
  console.log('Users:', users.value)
})()
</script>
