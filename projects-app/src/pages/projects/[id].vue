<template>
  <h1>Single Project {{ params.id }}</h1>
  <RouterLink to="/projects">Projects</RouterLink>
  <RouterLink to="/">Home</RouterLink>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const params = route.params as { id: string }
</script>
