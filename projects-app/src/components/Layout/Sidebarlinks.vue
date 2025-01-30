<template>
  <template v-for="link in links" :key="link.title">
    <RouterLink
      v-if="link.to"
      exactActiveClass="text-primary bg-muted"
      :to="link.to"
      class="nav-link"
    >
      <!-- Apply class dynamically -->
      <iconify-icon :icon="link.icon" :class="link.class"></iconify-icon>
      <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
    </RouterLink>
    <div v-else class="cursor-pointer nav-link" @click="emitActionClicked(link.title)">
      <!-- Apply class dynamically -->
      <iconify-icon :icon="link.icon" :class="link.class"></iconify-icon>
      <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
.nav-link {
  @apply flex items-center justify-center gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary lg:justify-normal text-muted-foreground;
}
</style>
