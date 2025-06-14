<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
const { activeError } = storeToRefs(useErrorStore())

const errorStore = useErrorStore()

onErrorCaptured((error) => {
  errorStore.setError({ error })
})

onMounted(() => {
  useAuthStore().trackAuthChanges()
})

/* Switch layout */
const { user } = storeToRefs(useAuthStore())
const AuthLayout = defineAsyncComponent(() => import('./components/Layout/main/AuthLayout.vue'))
const GuestLayout = defineAsyncComponent(() => import('./components/Layout/main/GuestLayout.vue'))

useMeta({
  title: 'Todo App'
})
</script>

<template>
  <Toaster />
  <metainfo></metainfo>
  <Transition name="fade" mode="out-in">
    <Component :is="user ? AuthLayout : GuestLayout" :key="user?.id">
      <AppErrorPage v-if="errorStore.activeError" />

      <RouterView v-else v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <div class="w-full" :key="route.path">
            <Suspense v-if="Component" :timeout="0">
              <Component :is="Component"></Component>
              <template #fallback>
                <div
                  class="absolute z-50 flex items-center justify-center w-full h-screen transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-background bg-opacity-90"
                >
                  <iconify-icon icon="lucide:loader-circle" class="text-6xl animate-spin" />
                </div>
              </template>
            </Suspense>
          </div>
        </Transition>
      </RouterView>
    </Component>
  </Transition>
</template>
