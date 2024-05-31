<template>
  <div>
    <h1>Project {{ route.params?.id }}</h1>
    <RouterLink to="/projects">Go to Projects</RouterLink>
  </div>
</template>

<script setup lang="ts">
// Import and initialize useRoute to access route parameters and metadata
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
