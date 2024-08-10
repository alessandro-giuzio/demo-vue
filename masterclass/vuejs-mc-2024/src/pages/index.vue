<template>
  <div>
    <h1>Home Page</h1>
    <RouterLink :to="{ name: '/projects/', params: { id: 1 } }">Go to Project 1</RouterLink>
  </div>
</template>

<script setup lang="ts">
usePageStore().pageData.title = 'Home Page'
</script>
