<template>
  <h1>Home Page</h1>
  <RouterLink :to="{ name: '/projects/[id]', params: { id: 1 } }">Go to Project 1</RouterLink>
</template>

<script setup lang="ts"></script>
