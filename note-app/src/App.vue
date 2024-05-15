<script setup>
/*imports*/
import { onMounted } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'
import { useStoreNotes } from '@/stores/storeNotes'

/* store */
const storeNotes = useStoreNotes()

/* mounted */
onMounted(() => {
  storeNotes.getNotes()
})
</script>
<template>
  <NavBar />
  <div class="container is-max-desktop px-2 pw-4">
    <RouterView />
  </div>
</template>
<style>
@import 'bulma/css/bulma.min.css';
</style>
