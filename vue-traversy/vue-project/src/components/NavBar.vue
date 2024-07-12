<template>
  <nav class="bg-green-700 border-b border-green-500">
    <div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <div
          class="flex items-center justify-center flex-1 md:items-stretch md:justify-start">
          <!-- Logo -->
          <a class="flex items-center flex-shrink-0 mr-4" href="index.html">
            <img class="w-auto h-10" :src="logo" alt="Vue Jobs" />
            <span class="hidden ml-2 text-2xl font-bold text-white md:block"
              >Vue Jobs</span
            >
          </a>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <a
                href="index.html"
                class="px-3 py-2 text-white bg-green-900 rounded-md hover:bg-gray-900 hover:text-white"
                >Home</a
              >
              <a
                href="jobs.html"
                class="px-3 py-2 text-white rounded-md hover:bg-green-900 hover:text-white"
                >Jobs</a
              >
              <a
                href="add-job.html"
                class="px-3 py-2 text-white rounded-md hover:bg-green-900 hover:text-white"
                >Add Job</a
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
</script>
