<template>
  <h1>Project {{ route.params?.slug }}</h1>
</template>

<script setup lang="ts">
const route = useRoute<'/projects/[slug]'>()
</script>
