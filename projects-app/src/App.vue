<script setup lang="ts">
import { supabase } from './lib/supabaseClient'

const { activeError } = storeToRefs(useErrorStore())
const authStore = useAuthStore()
const errorStore = useErrorStore()

onErrorCaptured((error) => {
  errorStore.setError({ error })
})

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (data.session?.user) await authStore.setAuth(data.session)
})
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
