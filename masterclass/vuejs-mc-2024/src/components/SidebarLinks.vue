<template>
  <RouterLink
    activeClass="text-primary bg-muted"
    exactActiveClass=""
    v-for="link in links"
    :key="link.title"
    :to="link.to"
    class="flex items-center justify-center gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary lg:justify-normal text-muted-foreground"
  >
    <iconify-icon :icon="link.icon"></iconify-icon>
    <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
type SidebarLinksProps = {
  to: string
  icon: string
  title: string
}

defineProps<{
  links: SidebarLinksProps[]
}>()
</script>
