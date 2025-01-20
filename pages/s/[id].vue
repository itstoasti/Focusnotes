<template>
  <div class="min-h-screen flex items-center justify-center">
    <base-loading v-if="isLoading" class="h-8 w-8" />
    <div v-else-if="error" class="text-red-500">
      Link not found
    </div>
  </div>
</template>

<script setup>
import { useShortLinkStore } from '~/stores/shortLinks'

const route = useRoute()
const shortLinks = useShortLinkStore()
const isLoading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const longUrl = await shortLinks.getLongUrl(route.params.id)
    if (longUrl) {
      window.location.href = longUrl
    } else {
      error.value = true
    }
  } catch (e) {
    error.value = true
  } finally {
    isLoading.value = false
  }
})
</script> 