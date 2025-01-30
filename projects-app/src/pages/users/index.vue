<template>
  <main>
    <ul>
      <li v-for="user in users" :key="user.id">
        <RouterLink :to="`/users/${user.username}`" class="text-[#40B983] hover:underline">
          {{ user.username }}
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { ref } from 'vue'
import type { Tables } from '../../../database/types'
usePageStore().pageData.title = 'Users Page'

const users = ref<Tables<'users'>[] | null>(null)
;(async () => {
  const { data, error } = await supabase.from('users').select('*')
  if (error) console.log(error)
  users.value = data
  console.log('Users:', users.value)
})()
</script>
