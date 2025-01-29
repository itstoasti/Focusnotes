<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h2 class="text-lg font-medium text-gray-900">Connecting your account...</h2>
      <p class="mt-2 text-sm text-gray-500">Please wait while we finish setting up your connection.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(async () => {
  // Short delay to ensure the OAuth data is processed
  setTimeout(() => {
    navigateTo('/settings')
  }, 1000)
})
</script> 