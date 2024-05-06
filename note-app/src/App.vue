<script setup>
/*
imports
 */
import NavBar from '@/components/layout/NavBar.vue'
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
