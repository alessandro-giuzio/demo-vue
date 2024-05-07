<template>
  <div class="edit-note">
    <AddEditNote
      ref="addEditNoteRef"
      placeholder="Edit note"
      bgColor="link"
      v-model="noteContent"
      label="Edit Note"
    >
      <template #buttons>
        <button
          class="button is-link has-background-link mr-3"
          :disabled="!noteContent"
          @click="handleSaveClick"
        >
          Save Note
        </button>
        <button @click="$router.push('/')" class="button is-link is-light">Cancel</button>
      </template>
    </AddEditNote>
  </div>
</template>

<script setup>
/* imports */
import AddEditNote from '@/components/Notes/AddEditNote.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStoreNotes } from '@/stores/storeNotes'

/* router */

const route = useRoute()
const router = useRouter()

/* store */
const storeNotes = useStoreNotes()
/* note */
const noteContent = ref('')
noteContent.value = storeNotes.getNoteContent(route.params.id)

/* save clicked */
const handleSaveClick = () => {
  storeNotes.updateNote(route.params.id, noteContent.value)
  router.push('/')
}
</script>
