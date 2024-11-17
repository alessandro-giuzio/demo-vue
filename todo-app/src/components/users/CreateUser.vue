<template>
  <div class="wrapper-form">
    <form @submit.prevent="createUser">
      <div class="field">
        <label for="name">Name:</label>
        <input v-model="name" type="text" id="name" />
      </div>
      <div class="field">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email-create" />
      </div>
      <div class="field">
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password-create" />
      </div>
      <button type="submit">Create User</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
<style scoped>
.wrapper-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fefefe;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

form {
  width: 100%;
  text-align: left;
}

.field {
  margin-bottom: 1.5rem;
  text-align: left;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2f855a;
}

.field input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.field input:focus {
  outline: none;
  border-color: #38a169;
  box-shadow: 0 0 5px rgba(56, 161, 105, 0.5);
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #38a169;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2f855a;
}

.button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
</style>
