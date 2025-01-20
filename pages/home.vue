# Create a new home page with a dashboard layout
<template>
  <div class="h-screen w-full">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content -->
    <div class="bg-slate-50 min-h-screen">
      <!-- Header -->
      <div class="border-b bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Quick Stats -->
          <div class="bg-white rounded-lg border p-6 space-y-4">
            <h2 class="text-lg font-medium text-gray-900">Quick Stats</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500">Total Links</div>
                <div class="text-2xl font-semibold text-gray-900">{{ data.ls.length }}</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500">Active Template</div>
                <div class="text-2xl font-semibold text-gray-900 capitalize">{{ data.template }}</div>
              </div>
            </div>

            <!-- Top Clicked Links -->
            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Top Clicked Links</h3>
              <div class="space-y-3">
                <div v-if="topLinks.length === 0" class="text-sm text-gray-500 text-center py-4">
                  No published links yet
                </div>
                <div
                  v-for="link in topLinks"
                  :key="link.id"
                  class="bg-gray-50 p-3 rounded-lg flex items-center justify-between"
                >
                  <div class="min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">
                      {{ link.nickname || 'Untitled Link' }}
                    </div>
                    <div class="text-xs text-gray-500 truncate">
                      {{ shortUrl(link.id) }}
                    </div>
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ link.clicks }} clicks
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg border p-6 space-y-4">
            <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div class="space-y-3">
              <button
                @click="navigateTo('/editor')"
                class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Icon icon="ph:plus-circle-bold" class="h-5 w-5 mr-2" />
                Create Link
              </button>
              <button
                @click="navigateTo('/links')"
                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Icon icon="ph:link-bold" class="h-5 w-5 mr-2" />
                My Links
              </button>
              <button
                @click="navigateTo('/analytics')"
                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Icon icon="ph:chart-line-up-bold" class="h-5 w-5 mr-2" />
                Analytics
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

// Auth
const client = useSupabaseClient()
const user = useSupabaseUser()

// Define middleware
definePageMeta({
  middleware: ['auth']
})

interface Link {
  l: string
  u: string
  i?: string
  img?: string
  price?: string
  description?: string
}

interface FormData {
  n: string
  d: string
  i: string
  f: string
  t: string
  ig: string
  gh: string
  tg: string
  l: string
  e: string
  w: string
  y: string
  ls: Link[]
  template: 'simple' | 'store'
}

const data = ref<FormData>({
  n: "",
  d: "",
  i: "",
  f: "",
  t: "",
  ig: "",
  gh: "",
  tg: "",
  l: "",
  e: "",
  w: "",
  y: "",
  ls: [],
  template: "simple",
});

interface PublishedLink {
  id: string
  nickname?: string
  clicks: number
}

const topLinks = ref<PublishedLink[]>([])
const origin = ref('')

// Get origin on client-side only
onMounted(() => {
  origin.value = window.location.origin
  fetchTopLinks()
  
  // Refresh every 30 seconds
  const interval = setInterval(fetchTopLinks, 30000)
  
  // Clean up interval on component unmount
  onUnmounted(() => clearInterval(interval))
})

// Generate short URL
const shortUrl = (id: string) => {
  return `${origin.value}/s/${id}`
}

// Fetch top clicked links
const fetchTopLinks = async () => {
  try {
    const { data, error } = await client
      .from('short_links')
      .select('id, nickname, clicks')
      .order('clicks', { ascending: false })
      .limit(5)

    if (error) throw error
    
    // Filter out links with 0 clicks
    topLinks.value = data.filter(link => link.clicks > 0)
  } catch (error) {
    console.error('Error fetching top links:', error)
  }
}
</script> 