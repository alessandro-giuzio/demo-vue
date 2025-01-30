<template>
  <main>
    <ul>
      <li v-for="user in users" :key="user.id">
        <RouterLink
          :to="`/users/${user.username}`"
          class="hover:underline"
          :class="{
            'text-[#40B983] font-bold': user.username === userReg?.username,
            'text-gray-600': user.username !== userReg?.username
          }"
        >
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
import { useAuthStore } from '@/stores/auth'

usePageStore().pageData.title = 'Users Page'

const users = ref<Tables<'users'>[] | null>(null)
const { userReg } = storeToRefs(useAuthStore()) // Get logged-in user details

// Fetch users from Supabase
;(async () => {
  const { data, error } = await supabase.from('users').select('*')
  if (error) console.log(error)
  users.value = data
})()
</script>
