<script setup lang="ts">
import GithubCard from '@/components/GithubCard.vue'
</script>
<template>
  <div class="about flex flex-col gap-2">
    <h1>This is an about page</h1>
    <GithubCard username="alessandro-giuzio" />
    <GithubCard username="michael-andreuzza" />
    <GithubCard username="spences10" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
