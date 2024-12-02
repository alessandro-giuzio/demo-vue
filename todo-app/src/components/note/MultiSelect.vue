<template>
  <details>
    <summary>Select a user to share your note with</summary>
    <form>
      <label for="users">Users:</label>
      <fieldset>
        <legend>Users</legend>
        <select id="sharedUsers" multiple class="multi-select" v-model="selectedSharedUsers">
          <option
            v-for="user in users"
            :key="user.id"
            :value="user.id"
            :disabled="user.id === loggedInUser?.id"
          >
            {{ user.name }}
          </option>
        </select>
      </fieldset>
    </form>
  </details>
</template>

<script setup lang="ts"></script>
