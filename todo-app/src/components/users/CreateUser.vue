<template>
  <div>
    <span>Create User</span>
    <form @submit.prevent="createUser">
      <div>
        <label for="name">Name:</label>
        <input v-model="name" type="text" id="name" />
      </div>
      <div>
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" />
      </div>
      <button type="submit">Create User</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineEmits } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const emits = defineEmits(['newUser'])

const createUser = () => {
  const newUser = {
    id: crypto.randomUUID(),
    name: name.value,
    email: email.value,
    password: password.value
  }
  emits('newUser', newUser)
  name.value = ''
  email.value = ''
  password.value = ''
}
//set up an emitted event to send the new user data back to App.vue.
</script>
