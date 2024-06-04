<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'

console.log(supabase)
</script>
