<template>
  <template v-for="link in links" :key="link.title">
    <RouterLink
      v-if="link.to"
      activeClass="text-primary bg-muted"
      exactActiveClass=""
      :to="link.to"
      class="nav-link"
    >
      <iconify-icon :icon="link.icon"></iconify-icon>
      <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
    </RouterLink>
    <div v-else class="cursor-pointer nav-link" @click="emitActionClicked(link.title)">
      <iconify-icon :icon="link.icon"></iconify-icon>
      <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
type SidebarLinksProps = {
  to?: string
  icon: string
  title: string
}

defineProps<{
  links: SidebarLinksProps[]
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
