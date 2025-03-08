<template>
  <nav class="flex items-center justify-between h-16 gap-2 px-6 border-b bg-muted/40">
    <form class="relative w-full h-fit max-w-96">
      <iconify-icon
        class="absolute top-[50%] translate-y-[-50%] left-2.5 text-muted-foreground"
        icon="lucide:search"
      ></iconify-icon>
      <Input class="w-full pl-8 bg-background" type="text" placeholder="Search ..." />
    </form>
    <div class="flex items-center justify-center gap-1">
      <Button>
        <Transition @click="toggleDark()" class="flex w-8 h-8" name="scale" mode="out-in">
          <iconify-icon v-if="isDark" icon="lucide:sun"></iconify-icon>
          <iconify-icon v-else icon="lucide:moon"></iconify-icon>
        </Transition>
      </Button>
      <div class="w-8">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                :src="userReg?.avatar_url || ''"
                :alt="`${userReg?.full_name}profile picture`"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const { userReg } = storeToRefs(useAuthStore())

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
