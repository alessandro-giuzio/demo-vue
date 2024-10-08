<template>
  <div class="modal" v-if="modelValue">
    <div class="modal-content">
      <header class="modal-header">
        <h2>Edit Note</h2>
        <button class="close-button">X</button>
      </header>
      <div class="modal-body">
        <!-- Input for editing the note content -->
        <textarea name="" id="" rows="4"></textarea>
      </div>
      <footer class="modal-footer">
        <button @click="closeModal">Cancel</button>
        <button>Save</button>
      </footer>
    </div>
    <span class="text-black">this is a modal</span>
  </div>
</template>

<script setup lang="ts">
/* Imports */

/* Props to recieve the current note content and modal visibility */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  noteContent: {
    type: String,
    required: true
  }
})

/* Emits to notify the parent component of modal visibility */
const emit = defineEmits(['update:modelValue', 'save'])

/* Function to close the modal */
const closeModal = () => {
  emit('update:modelValue', false)
}
</script>

<style>
h2 {
  margin: 0;
  color: blue;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-content {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.modal-body {
  margin: 1rem 0;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
