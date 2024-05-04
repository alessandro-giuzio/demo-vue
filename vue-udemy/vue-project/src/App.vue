<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { reactive, provide } from 'vue'

import { useOnline } from '@vueuse/core'

/* user data */
const userData = reactive({
  name: 'Max',
  username: 'max-schwarzmueller'
})

/* online status */
const online = useOnline()

provide('userData', userData)
</script>

<template>
  <div class="user-data">
    {{ userData.name }} @{{ userData.username }}
    Network Status:
    <span :style="{ color: online ? 'green' : 'red', fontSize: '16px', fontWeight: 'bold' }">
      {{ online ? 'Online' : 'Offline' }}
    </span>
  </div>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/posts">Posts</RouterLink>
    <RouterLink to="/modals">Modals</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.user-data {
  position: absolute;
  top: 0;
  right: 0;
  background-color: beige;
  padding: 10px;
  font-size: 12px;
}

.off-line {
  color: red;
  font-weight: bold;
}
</style>
