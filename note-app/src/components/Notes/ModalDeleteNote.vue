<template>
  <div class="modal is-active p-2">
    <div class="modal-background"></div>
    <div class="modal-card" ref="modalCardRef">
      <header class="modal-card-head">
        <p class="modal-card-title">Delete Note?</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <p>Are you sure you want to delete this note?</p>
      </section>
      <footer class="modal-card-foot is-justify-content-flex-end">
        <div class="buttons">
          <button class="button" @click="closeModal">Cancel</button>
          <button class="button is-danger" @click="storeNotes.deleteNote(noteId)">Delete</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
/* imports */
import { onClickOutside } from '@vueuse/core'
import { ref, onMounted, onUnmounted } from 'vue'
import { useStoreNotes } from '@/stores/storeNotes'

/* props */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  noteId: {
    type: String,
    required: true
  }
})

/* emits */
const emit = defineEmits(['update:modelValue'])

/* store */
const storeNotes = useStoreNotes()

/* close modal */
const closeModal = () => {
  emit('update:modelValue', false)
}

/*  click outside to close */
const modalCardRef = ref(null)
onClickOutside(modalCardRef, closeModal)

/* keyboard control modal */

const handleKeyboard = (e) => {
  if (e.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keyup', handleKeyboard)
})
onUnmounted(() => {
  document.removeEventListener('keyup', handleKeyboard)
})
</script>
