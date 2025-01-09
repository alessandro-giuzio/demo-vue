<template>
  <div class="flex flex-col items-center justify-center w-full py-10 mx-auto mb-10 text-center">
    <div class="flex flex-col items-center justify-center pb-4">
      <Avatar size="lg" class="mb-2">
        <AvatarImage :src="userReg?.avatar_url || ''" alt="avatar image" />
        <AvatarFallback>FB</AvatarFallback>
      </Avatar>
      <p class="mt-2 text-gray-500">{{ userReg?.username }}</p>
      <h1 class="mt-5 text-4xl font-bold">{{ userReg?.full_name }}</h1>
      <p class="mt-2 text-sm">{{ userReg?.bio }}</p>
      <iconify-icon icon="akar-icons:user" />
    </div>
    <Button>Edit profile</Button>
  </div>
</template>

<script setup lang="ts">
import { userRegQuery } from '@/utils/supaQueries'
import type { Tables } from 'database/types'

const { username } = useRoute('/users/[username]').params

const user = ref<Tables<'users'> | null>(null)

const getTasks = async () => {
  const { data, error, status } = await userRegQuery({
    column: 'username',
    value: username
  })
  if (error) useErrorStore().setError({ error, customCode: status })

  user.value = data
}
await getTasks()
const { userReg } = storeToRefs(useAuthStore())
</script>
