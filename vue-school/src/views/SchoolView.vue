<script setup lang="ts">
import { ref } from 'vue'
const header = ref('Shopping List App')
const editing = ref(false)
const items = ref([
  /*  { id: 1, label: '10 Apples' },
  { id: 2, label: '2 Bananas' },
  { id: 3, label: '10 Cherrys' },
  { id: 4, label: '2 Dates' },
  { id: 5, label: '45 Elderberrys' },
  { id: 6, label: '2 Figs' } */
])

const newItem = ref('')
const newItemHighPriority = ref('false')
const saveItem = () => {
  items.value.push({ id: items.value.length + 1, label: newItem.value })
  newItem.value = ''
}
const doEdit = (e) => {
  editing.value = e
  newItem.value = ''
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>{{ header }}</h1>
      <button v-if="editing" class="btn" @click="doEdit(false)">Cancel</button>
      <button v-else class="btn btn-primary" @click="doEdit(true)">Add Item</button>
    </div>
    <form class="add-item-form" @submit.prevent="saveItem" v-if="editing">
      <input v-model.trim="newItem" id="addItem" placeholder="Add an item" />
      <label>
        <input type="checkbox" v-model="newItemHighPriority" />
        High Priority
      </label>
      <button :disabled="newItem.length < 5" class="btn btn-primary">Save Item</button>
    </form>
    <ul>
      <li v-for="{ id, label } in items" :key="id">
        {{ label }}
      </li>
    </ul>
    <p v-if="!items.length">Nothing to see here</p>
  </div>
</template>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 0.5rem;
  max-width: 300px;
}

.prio {
  display: flex;
  gap: 1.5rem;
}
</style>
