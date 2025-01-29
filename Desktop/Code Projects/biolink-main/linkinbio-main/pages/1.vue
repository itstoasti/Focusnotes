<template>
  <div class="min-h-screen" :style="{ backgroundColor: decodedData?.theme?.colors?.background }">
    <ThemeProvider class="min-h-screen">
      <component 
        :is="selectedTemplate" 
        v-if="decodedData" 
        :data="decodedData" 
        class="min-h-screen" 
      />
      <div
        v-else
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <base-loading class="h-5 w-5" />
      </div>
    </ThemeProvider>
    
    <!-- Branding -->
    <a
      v-if="decodedData?.theme?.showBranding"
      href="https://twitter.com/biolink-toast"
      target="_blank"
      class="fixed bottom-0 right-0 bg-white rounded-tl-lg shadow px-4 py-1 font-medium text-sm text-gray-500 hover:bg-slate-50 z-50"
    >
      BIOLINK
    </a>
  </div>
</template>

<script setup>
import { decodeData } from "../utils/transformer";
import { useThemeStore } from '~/stores/theme'
import { useAnalyticsStore } from '~/stores/analytics'
import '@iconify/vue'
import { Icon } from '@iconify/vue'
import Simple from '~/components/Templates/Simple.vue'
import Store from '~/components/Templates/Store.vue'
import Blog from '~/components/Templates/Blog.vue'

// Register Icon component globally
const nuxtApp = useNuxtApp()
nuxtApp.vueApp.component('icon', Icon)

const route = useRoute();
const theme = useThemeStore()
const analytics = useAnalyticsStore()
const acc = route.query.data;
const decodedData = ref({});

// Compute the correct template based on the data
const selectedTemplate = computed(() => {
  switch (decodedData.value?.template) {
    case 'store':
      return Store
    case 'blog':
      return Blog
    case 'simple':
    default:
      return Simple
  }
})

// Track page view when component mounts
onMounted(async () => {
  if (acc) {
    decodedData.value = decodeData(acc);
    if (decodedData.value?.theme) {
      theme.setTheme(decodedData.value.theme);
    }
    // Track the page view using the shortId or full URL as the pageId
    const pageId = route.path;
    await analytics.trackPageView(pageId);
  }
});
</script>

<style>
/* Ensure the theme root takes full height */
.theme-root {
  min-height: 100vh;
}
</style>
