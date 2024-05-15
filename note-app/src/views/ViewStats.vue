<template>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>Stat</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Number of Notes</td>
        <td>{{ storeNotes.totalNotesCounts }}</td>
      </tr>
      <tr>
        <td>Number of Characters (of all notes)</td>
        <td>{{ storeNotes.totalCharactersCount }}</td>
      </tr>
    </tbody>
  </table>
  <input
    class="input"
    placeholder="Do you love this note App?"
    type="text"
    v-autofocus
    v-model="loveNoteApp"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useStoreNotes } from '@/stores/storeNotes'
import { vAutofocus } from '@/directives/vAutofocus'
import { useWatchCharacters } from '@/use/useWatchCharacters'

/* store */
const storeNotes = useStoreNotes()

/* love note app */
const loveNoteApp = ref('')

useWatchCharacters(loveNoteApp, 50)
</script>
