<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

import { ref, onMounted } from 'vue'

const users = ref([])

const loadUsersFromLocalStorage = () => {
  const storedUsers = localStorage.getItem('users')
  if (storedUsers) {
    users.value = JSON.parse(storedUsers)
  } else {
    createDefaultUser()
  }
}

const saveUsersToLocalStorage = () => {
  localStorage.setItem('users', JSON.stringify(users.value))
}

const createDefaultUser = () => {
  const defaultUser = {
    id: crypto.randomUUID(), // Generate a unique ID
    name: 'Default User',
    email: 'default@example.com',
    password: 'password123'
  }
  users.value.push(defaultUser)
  saveUsersToLocalStorage()
}

onMounted(() => {
  loadUsersFromLocalStorage()
})
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/todo">To-Do</RouterLink>
        <RouterLink to="/note">Note</RouterLink>
      </nav>
      <div class="p-6">
        <h1 class="mb-4 text-2xl font-bold">User List</h1>
        <div v-if="users.length">
          <ul>
            <li v-for="user in users" :key="user.id" class="mb-2">
              <p><strong>ID:</strong> {{ user.id }}</p>
              <p><strong>Name:</strong> {{ user.name }}</p>
              <p><strong>Email:</strong> {{ user.email }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>

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

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
