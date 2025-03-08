<template>
  <template v-for="link in links" :key="link.title">
    <RouterLink
      v-if="link.to"
      exactActiveClass="text-primary bg-muted"
      :to="link.to"
      class="nav-link"
      :class="{ 'justify-normal': menuOpen, 'justify-center': !menuOpen }"
    >
      <!-- Apply class dynamically -->
      <iconify-icon :icon="link.icon" :class="link.class"></iconify-icon>
      <span class="text-nowrap" :class="{ block: menuOpen, hidden: !menuOpen }">
        {{ link.title }}
      </span>
    </RouterLink>
    <div
      v-else
      class="cursor-pointer nav-link"
      :class="{ 'justify-normal': menuOpen, 'justify-center': !menuOpen }"
      @click="emitActionClicked(link.title)"
    >
      <!-- Apply class dynamically -->
      <iconify-icon :icon="link.icon" :class="link.class"></iconify-icon>
      <span class="text-nowrap" :class="{ block: menuOpen, hidden: !menuOpen }">{{
        link.title
      }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useMenu } from '@/composables/menu'
type LinkProp = {
  title: string
  to?: string
  icon: string
  class?: string // Accept class dynamically
}

defineProps<{
  links: LinkProp[]
}>()

const emits = defineEmits<{
  actionClicked: [string]
}>()

const emitActionClicked = (linkTitle: string) => {
  emits('actionClicked', linkTitle)
}

const { menuOpen } = useMenu()
</script>

<style scoped>
.nav-link {
  @apply flex items-center  gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary  text-muted-foreground;
}
</style>
