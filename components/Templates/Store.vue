<template>
  <div class="theme-root min-h-screen flex flex-col" :style="{ backgroundColor: 'var(--background)' }">
    <!-- Profile Header -->
    <div class="w-full">
      <div class="max-w-2xl mx-auto px-4 py-8 text-center bg-white shadow rounded-lg my-8">
        <img 
          v-if="data.i" 
          :src="data.i" 
          :alt="data.n"
          class="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        >
        <h1 class="text-2xl font-bold text-text">{{ data.n }}</h1>
        <p class="mt-2 text-text">{{ data.d }}</p>
        
        <!-- Social Links -->
        <div class="mt-6 flex justify-center flex-wrap gap-4">
          <a v-if="data.f" :href="data.f" target="_blank" class="text-primary hover:opacity-75">
            <Icon icon="mdi:facebook" class="h-6 w-6" />
          </a>
          <a v-if="data.t" :href="data.t" target="_blank" class="text-primary hover:opacity-75">
            <Icon icon="mdi:twitter" class="h-6 w-6" />
          </a>
          <a v-if="data.ig" :href="data.ig" target="_blank" class="text-primary hover:opacity-75">
            <Icon icon="mdi:instagram" class="h-6 w-6" />
          </a>
          <a v-if="data.gh" :href="data.gh" target="_blank" class="text-primary hover:opacity-75">
            <Icon icon="ph:github-logo-duotone" class="h-6 w-6" />
          </a>
          <a v-if="data.tg" :href="data.tg" target="_blank" class="text-primary hover:opacity-75">
            <Icon icon="ph:telegram-logo-duotone" class="h-6 w-6" />
          </a>
          <a v-if="data.w" :href="data.w" target="_blank" class="text-primary hover:opacity-75">
            <Icon icon="ph:whatsapp-logo-duotone" class="h-6 w-6" />
          </a>
          <a v-if="data.y" :href="data.y" target="_blank" class="text-primary hover:opacity-75">
            <Icon icon="ph:youtube-logo-duotone" class="h-6 w-6" />
          </a>
          <a v-if="data.e" :href="`mailto:${data.e}`" target="_blank" class="text-primary hover:opacity-75">
            <Icon icon="ph:envelope-duotone" class="h-6 w-6" />
          </a>
          <a v-if="data.l" :href="data.l" target="_blank" class="text-primary hover:opacity-75">
            <Icon icon="ph:linkedin-logo-duotone" class="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="flex-1 w-full">
      <div class="max-w-2xl mx-auto px-4 py-8 bg-white rounded-lg my-8">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="link in data.ls" :key="link.u" class="group">
            <div class="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                :src="link.img || 'https://via.placeholder.com/400'" 
                :alt="link.l"
                class="w-full h-full object-center object-cover group-hover:opacity-75"
              >
            </div>
            <div class="mt-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-text">{{ link.l }}</h3>
                <p class="text-sm font-medium text-text">${{ link.price || '0.00' }}</p>
              </div>
              <p class="mt-1 text-sm text-text line-clamp-2">{{ link.description || 'No description available' }}</p>
              <button
                @click="handleClick(link.u)"
                class="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-button bg-button hover:opacity-90"
              >
                View Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAnalyticsStore } from '~/stores/analytics'

const analytics = useAnalyticsStore()

defineProps<{
  data: {
    n: string
    d: string
    i: string
    f?: string
    t?: string
    ig?: string
    gh?: string
    tg?: string
    w?: string
    y?: string
    e?: string
    l?: string
    ls: Array<{
      l: string
      u: string
      img?: string
      price?: string
      description?: string
    }>
  }
}>()

const handleClick = async (url: string) => {
  await analytics.trackLinkClick(url)
  window.open(url, '_blank')
}
</script>

<style scoped>
.theme-root {
  min-height: 100vh;
}

.text-text {
  color: var(--text);
  font-family: var(--body-font);
}

.text-primary {
  color: var(--primary);
}

.text-button {
  color: var(--button-text, white);
}

.bg-button {
  background-color: var(--button-bg, var(--primary));
}

.aspect-w-1 {
  position: relative;
  padding-bottom: 100%;
}

.aspect-w-1 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style> 