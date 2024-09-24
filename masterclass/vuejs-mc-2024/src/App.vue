<template>
  <AuthLayout>
    <!-- Display the error page if there is an active error in the store -->
    <AppErrorPage v-if="errorStore.activeError" />

    <!-- Otherwise, display the routed component -->
    <RouterView v-else v-slot="{ Component, route }">
      <!-- Use Suspense to handle component loading states -->
      <!-- 'Component' is passed in dynamically through RouterView -->
      <Suspense v-if="Component" :timeout="0">
        <!-- Dynamically render the component for the current route -->
        <Component :is="Component" :key="route.name"></Component>

        <!-- Fallback content shown while the component is loading -->
        <template #fallback>
          <span> Loading... </span>
        </template>
      </Suspense>
    </RouterView>
  </AuthLayout>
</template>

<script setup lang="ts">
const errorStore = useErrorStore()
onErrorCaptured((error) => {
  errorStore.setError({ error })
})

onMounted(async () => {})
</script>
