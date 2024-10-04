<template>
  <h1>To Do list</h1>
  <main>
    <TodoMain />
  </main>
</template>

<script setup lang="ts">
import TodoMain from '../components/todo/TodoMain.vue'
</script>

<style scoped>
h1 {
  text-align: center;
  margin-top: 2rem;
  color: beige;
}
</style>
