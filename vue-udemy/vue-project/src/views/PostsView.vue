<script setup>
import { ref } from 'vue'

const posts = ref([
  { id: 'id1', title: 'Post 1', content: 'This is post 1' },
  { id: 'id2', title: 'Post 2', content: 'This is post 2' },
  { id: 'id3', title: 'Post 3', content: 'This is post 3' }
])
</script>
<template>
  <div class="posts">
    <h1>Posts</h1>

    <ul>
      <li v-for="post in posts" :key="post.id">
        <RouterLink :to="`/postDetail/${post.id}`">{{ post.title }}</RouterLink>
      </li>
    </ul>
  </div>
  <textarea name="" id=""></textarea>
</template>

<style scoped>
ul {
  margin-bottom: 30px;
}
</style>
