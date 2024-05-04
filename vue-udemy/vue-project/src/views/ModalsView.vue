<script setup>
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'
import ModalDark from '@/components/ModalDark.vue'
const showModal = ref(false)
const showDarkModals = ref(false)
</script>
<template>
  <div class="modals">
    <h1>Modals</h1>
    <div>
      <label>
        Show dark modals?
        <input type="checkbox" v-model="showDarkModals" />
      </label>
    </div>
    <button @click="showModal = true">Show Modal</button>
    <component
      :is="showDarkModals ? ModalDark : Modal"
      title="Modal Title (via prop)"
      v-model="showModal"
    >
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam dolorem, nobis dolore sit
        accusamus distinctio!
      </p>
    </component>
  </div>
</template>
