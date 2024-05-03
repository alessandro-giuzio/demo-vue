<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>
<template>
  <div class="modals">
    <h1>Modals</h1>
    <button @click="showModal = true">Show Modal</button>
    <div class="modal" v-if="showModal">
      <h1>This is a Modal</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam dolorem, nobis dolore sit
        accusamus distinctio!
      </p>
      <button @click="showModal = false">Hiding Modal</button>
    </div>
  </div>
</template>
<style scoped>
.modal {
  background-color: bisque;
  padding: 10px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
