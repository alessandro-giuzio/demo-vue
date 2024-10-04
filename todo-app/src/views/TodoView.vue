<template>
  <h1>To Do list</h1>
  <main>
    <TodoList />
  </main>
</template>

<script setup lang="ts">
import TodoList from '../components/todo/TodoList.vue'
</script>

<style scoped>
h1 {
  text-align: center;
  margin-top: 2rem;
  color: beige;
}
</style>
