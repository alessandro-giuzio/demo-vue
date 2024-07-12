<template>
  <section class="items-center justify-center text-center flex-flex-col h-96">
    <i class="mb-5 text-6xl text-yellow-500 pi pi-exclamation-triangle"> </i>
    <h1 class="mb-4 text-6xl font-bold">404 Not Found</h1>
    <p class="mb-5 text-xl">This page does not exist</p>
    <RouterLink
      to="/"
      class="px-3 py-2 mt-4 text-white bg-green-700 rounded-md hover:bg-green-900">
      Go back</RouterLink
    >
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
