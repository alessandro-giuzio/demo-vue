<template>
  <nav class="bg-green-700 border-b border-green-500">
    <div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <div
          class="flex items-center justify-center flex-1 md:items-stretch md:justify-start">
          <!-- Logo -->
          <RouterLink class="flex items-center flex-shrink-0 mr-4" to="/">
            <img class="w-auto h-10" :src="logo" alt="Vue Jobs" />
            <span class="hidden ml-2 text-2xl font-bold text-white md:block"
              >Vue Jobs</span
            >
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink
                to="/"
                :class="[
                  isActiveLink('/')
                    ? 'bg-green-900'
                    : 'hover:bg-gray-900 hover:text-white',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Home</RouterLink
              >
              <RouterLink
                to="/jobs"
                :class="[
                  isActiveLink('/jobs')
                    ? 'bg-green-900'
                    : 'hover:bg-gray-900 hover:text-white',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Jobs</RouterLink
              >
              <RouterLink
                to="/jobs/add"
                :class="[
                  isActiveLink('/jobs/add')
                    ? 'bg-green-900'
                    : 'hover:bg-gray-900 hover:text-white',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Add Job</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import logo from '@/assets/img/logo.png';
import { RouterLink, useRoute } from 'vue-router';

const isActiveLink = routePath => {
  const route = useRoute();
  return route.path === routePath;
};
</script>
