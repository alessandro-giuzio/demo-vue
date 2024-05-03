<template>
  <div class="posts-detail">
    <h1>This is a posts page</h1>
    <p>Display the content of post with ID of {{ $route.params.id }} here!</p>
    <div>
      <button @click="showPostId" class="btn">Show Post ID</button>
    </div>
    <div>
      <button @click="goBackHome" class="btn">Go Back Home In 3 seconds</button>
    </div>
    <p>
      <RouterLink to="/posts">&lt; Back to Posts</RouterLink>
    </p>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showPostId = () => {
  alert(route.params.id)
}

const goBackHome = () => {
  setTimeout(() => {
    router.push('/')
  }, 3000)
}
</script>
