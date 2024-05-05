<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'

const posts = ref([
  { id: 'id1', title: 'Post 1', content: 'This is post 1' },
  { id: 'id2', title: 'Post 2', content: 'This is post 2' },
  { id: 'id3', title: 'Post 3', content: 'This is post 3' }
])

const counter = useCounterStore()
/* counter button */
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
  <div>
    <button
      @click="counter.increment(1)"
      class="counter-button"
      :class="{ yellow: counter.oddOrEven === 'odd' }"
    >
      {{ counter.count }}
    </button>
  </div>
</template>

<style scoped>
ul {
  margin-bottom: 30px;
}
.counter-button {
  padding: 10px 20px;
  font-size: 1.2rem;
  width: 100%;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.yellow {
  background-color: yellow;
}
</style>
