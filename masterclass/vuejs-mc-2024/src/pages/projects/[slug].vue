<template>
  <div>
    <h1>Project {{ route.params?.slug }}</h1>
    <RouterLink to="/projects">Go to Projects</RouterLink>
  </div>
</template>

<script setup lang="ts">
// Import and initialize useRoute to access route parameters and metadata


const route = useRoute()
</script>
