<template>
  <article class="min-h-screen p-6 bg-gray-100">
    <!-- Article Container -->
    <div class="max-w-3xl p-8 mx-auto mb-6 bg-white rounded-lg shadow-md">
      <!-- Title -->
      <h1 class="mb-4 text-3xl font-bold text-gray-800">
        Understanding watch Deep: true in Vue.js
      </h1>

      <!-- Subtitle -->
      <h2 class="mb-6 text-xl font-semibold text-gray-700">
        Handling State Changes, Note Editing, and Task Management
      </h2>

      <!-- Section -->
      <section class="mb-6">
        <h3 class="mb-2 text-lg font-semibold text-gray-800">What Does `watch deep:true` Do?</h3>
        <p class="leading-relaxed text-gray-700">
          In Vue.js, the `deep: true` option in `watch` allows you to monitor changes within nested
          properties. This is especially useful for reactive objects, where changes within nested
          properties may not be detected without it.
        </p>
      </section>

      <!-- Section for Editing Notes -->
      <section class="mb-6">
        <h3 class="mb-2 text-lg font-semibold text-gray-800">Editing Notes</h3>
        <p class="leading-relaxed text-gray-700">
          When editing a note, load the selected note into the input fields, switching the button
          from "Add" to "Save" for clarity. Use the same form for both adding and editing by
          managing a "current" note object to store details of the active note.
        </p>
      </section>

      <!-- Detail View for Note -->
      <section class="mb-6">
        <h3 class="mb-2 text-lg font-semibold text-gray-800">Detail View for Note</h3>
        <p class="leading-relaxed text-gray-700">
          Create a route `/detail/{id}` for viewing note details. Notes should be stored with unique
          IDs, generated via UUID, and saved in `localStorage`. Upon loading, check if the note
          exists. If not, display a "Note not found" message.
        </p>
      </section>

      <!-- Task Management Tools Section -->
      <section class="mb-6">
        <h3 class="mb-2 text-lg font-semibold text-gray-800">Task Management Tools</h3>
        <p class="leading-relaxed text-gray-700">
          Implement a list of users with unique IDs, names, emails, and passwords, all saved in
          `localStorage`. On page load, check for existing users or create a new entry.
        </p>
      </section>

      <!-- Conclusion -->
      <footer class="mt-8 text-gray-600">
        <p>
          By using Vue's reactivity and Tailwind's styling, you can create a functional and visually
          appealing note management system that adapts to both additions and edits.
        </p>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts"></script>
