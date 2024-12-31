<script setup lang="ts">
const { activeError } = storeToRefs(useErrorStore())
</script>

<template>
  <AuthLayout>
    <!-- Refernce the AppError page if there is an error -->
    <AppErrorPage v-if="activeError" />
    <RouterView v-else v-slot="{ Component, route }">
      <Suspense v-if="Component" timeout="0">
        <Component :is="Component" :key="route.name"></Component>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </RouterView>
  </AuthLayout>
</template>
