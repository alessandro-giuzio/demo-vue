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
</template>

<script setup>
import { useStoreNotes } from '@/stores/storeNotes'

const storeNotes = useStoreNotes()
</script>
