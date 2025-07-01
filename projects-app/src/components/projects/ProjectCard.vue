<script setup lang="ts">
defineProps({
  project: {
    type: Object,
    required: true
  },
  showRole: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="p-4 transition-all border rounded-md hover:shadow-md">
    <div class="flex items-start justify-between mb-2">
      <h3 class="text-lg font-medium">
        <RouterLink :to="`/projects/${project.slug || project.id}`" class="hover:underline">
          {{ project.name }}
        </RouterLink>
      </h3>

      <!-- Show role badge if enabled -->
      <span
        v-if="showRole && project.user_role"
        class="text-xs px-2 py-0.5 rounded-full"
        :class="{
          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300':
            project.user_role === 'owner',
          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
            project.user_role === 'manager',
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300':
            project.user_role === 'member'
        }"
      >
        {{ project.user_role }}
      </span>
    </div>

    <p v-if="project.description" class="mb-3 text-sm text-muted-foreground line-clamp-2">
      {{ project.description }}
    </p>

    <div class="flex justify-between mt-2 text-xs text-muted-foreground">
      <span>{{ project.tasks_count || 0 }} tasks</span>
      <span>{{ new Date(project.created_at).toLocaleDateString() }}</span>
    </div>
  </div>
</template>
