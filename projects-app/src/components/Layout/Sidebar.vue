<template>
  <aside
    class="flex flex-col h-screen gap-2 border-r fixed bg-muted/40 transition-[width]"
    :class="{ 'w-52': menuOpen, 'w-24': !menuOpen }"
  >
    <div class="flex items-center justify-between h-16 gap-1 px-2 border-b lg:px-4 shrink-0">
      <Button @click="toggleMenu" variant="outline" size="icon" class="w-8 h-8">
        <iconify-icon icon="lucide:menu"></iconify-icon>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="icon" class="w-8 h-8">
            <iconify-icon icon="lucide:plus"></iconify-icon>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @click="$emit('taskClicked')">Task</DropdownMenuItem>
          <DropdownMenuItem @click="$emit('projectClicked')">Project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <nav class="relative flex flex-col justify-between h-full gap-2">
      <div>
        <Sidebarlinks :links="links" />
      </div>

      <div class="py-3 text-center border-y bg-background">
        <Sidebarlinks :links="computedAccountLinks" @actionClicked="executeAction" />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useMenu } from '@/composables/menu'

const { userReg } = storeToRefs(useAuthStore()) // Get logged-in user details

// Track if the user is logged in
const isLoggedIn = computed(() => !!userReg.value)
console.log(isLoggedIn.value)

const links = [
  { title: 'Dashboard', to: '/', icon: 'lucide:house' },
  { title: 'Projects', to: '/projects', icon: 'lucide:building-2' },
  { title: 'My Tasks', to: '/tasks', icon: 'lucide:badge-check' },
  { title: 'Users', to: '/users', icon: 'lucide-users' }
]

// Compute the user profile link dynamically
const computedAccountLinks = computed(() => [
  {
    title: 'User',
    to: isLoggedIn.value && userReg.value ? `/users/${userReg.value.username}` : '/users',
    icon: 'lucide:user',
    class: isLoggedIn.value ? 'text-green-500' : 'text-gray-500' // Green when logged in, gray when logged out
  },
  { title: 'Settings', to: '/settings', icon: 'lucide:settings' },
  { title: 'Sign out', icon: 'lucide:log-out' }
])

const router = useRouter()

const executeAction = async (linkTitle: string) => {
  if (linkTitle === 'Sign out') {
    const { logout } = await import('@/utils/supaAuth')
    const isLoggedOut = await logout()

    if (isLoggedOut) {
      router.push('/login')
    }
  }
}

defineEmits(['taskClicked', 'projectClicked'])

const { menuOpen, toggleMenu } = useMenu()

const windowWidth = useWindowSize().width

watchEffect(() => {
  if (windowWidth.value > 1024) {
    menuOpen.value = true
  } else {
    menuOpen.value = false
  }
})
</script>
