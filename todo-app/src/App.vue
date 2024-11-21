<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import CreateUser from './components/users/CreateUser.vue'

import { ref, onMounted } from 'vue'

/* Rective Variables */
const isLoggedIn = ref(false) // Tracks if the user is logged in
const loggedInUser = ref<User | null>(null) // Stores the currently logged-in user
const loginEmail = ref('') // Email entered in login form
const loginPassword = ref('') // Password entered in login form
const loginError = ref('') // Error message for login failures

const handleLogin = () => {
  // Find the user with the matching email and password
  const user = users.value.find(
    (u) => u.email === loginEmail.value && u.password === loginPassword.value
  )

  if (user) {
    isLoggedIn.value = true // Mark as logged in
    loggedInUser.value = user // Store the logged-in user details
    loginError.value = '' // Clear any error messages
    // Save to sessionStorage
    sessionStorage.setItem('loggedInUser', JSON.stringify(user))
    sessionStorage.setItem('isLoggedIn', 'true')
  } else {
    loginError.value = 'Invalid email or password' // Show error message
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  loggedInUser.value = null
  sessionStorage.removeItem('loggedInUser')
  sessionStorage.removeItem('isLoggedIn')
}

type User = {
  id: string
  name: string
  email: string
  password: string
}

const STORAGE_Key = 'users' // Define a key for localStorage

const users = ref<User[]>([]) // Define users as a reactive ref array

// Function to load users from localStorage or create a default user if none exist
const loadUsersFromLocalStorage = () => {
  const storedUsers = localStorage.getItem(STORAGE_Key)
  if (storedUsers) {
    users.value = JSON.parse(storedUsers)
  } else {
    createDefaultUsers()
  }
}

// Function to save the users array to localStorage
const saveUsersToLocalStorage = () => {
  localStorage.setItem(STORAGE_Key, JSON.stringify(users.value))
}

// Function to create a default user and save it to localStorage
const createDefaultUsers = () => {
  const defaultUsers = [
    {
      id: crypto.randomUUID(),
      name: 'Default User 1',
      email: 'user1@example.com',
      password: 'password123'
    },
    {
      id: crypto.randomUUID(),
      name: 'Default User 2',
      email: 'user2@example.com',
      password: 'password123'
    },
    {
      id: crypto.randomUUID(),
      name: 'Default User 3',
      email: 'user3@example.com',
      password: 'password123'
    },
    {
      id: crypto.randomUUID(),
      name: 'Default User 4',
      email: 'user@email.com',
      password: 'password123'
    }
  ]
  // Add all default users to the `users` array
  users.value.push(...defaultUsers)
  saveUsersToLocalStorage() // Save the updated users array to localStorage
}

// Function to handle the userCreated event
const handleUserCreated = (newUser: User) => {
  users.value.push(newUser)
  saveUsersToLocalStorage()
}
// Load users from localStorage when the component mounts
onMounted(() => {
  loadUsersFromLocalStorage()
  // Restore login state
  const storedUser = sessionStorage.getItem('loggedInUser')
  const storedLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'
  if (storedUser && storedLoggedIn) {
    loggedInUser.value = JSON.parse(storedUser)
    isLoggedIn.value = true
  }
})
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <!-- Show Login Form if not logged in -->
      <div v-if="!isLoggedIn" class="simple-form">
        <p class="message">Please log in to access the application.</p>
        <form @submit.prevent="handleLogin">
          <div class="field">
            <label for="email">Email:</label>
            <input
              v-model="loginEmail"
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="field">
            <label for="password">Password:</label>
            <input
              v-model="loginPassword"
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" class="button">Login</button>
          <p v-if="loginError" class="error">{{ loginError }}</p>
        </form>
        <span class="message">Or create a new user fro the new Browser</span>
        <CreateUser @new-user="handleUserCreated" />
      </div>
      <!-- Show App Content if logged in -->
      <div v-else>
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/todo">To-Do</RouterLink>
          <RouterLink to="/note">Note</RouterLink>
          <RouterLink to="/users">Users</RouterLink>
        </nav>
        <p>Logged in as: {{ loggedInUser?.name || 'Uknown user' }}</p>
        <!-- logout button -->
        <button class="logout" @click="handleLogout">Logout</button>
      </div>
    </div>
  </header>

  <RouterView v-if="isLoggedIn" :loggedInUser="loggedInUser" />
</template>

<style scoped>
.message {
  color: #e53e3e;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}
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
    flex-direction: column;
    gap: 1rem;
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
.simple-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.field {
  margin-bottom: 1rem;
}
.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2f855a;
}
.field input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #38a169;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.button:hover {
  background-color: #2f855a;
}

.error {
  color: #e53e3e;
  margin-top: 0.5rem;
  font-weight: bold;
}

button.logout {
  background-color: #e53e3e;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
