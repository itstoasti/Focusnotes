# Create a new home page with a dashboard layout
<template>
  <div class="h-screen w-full grid grid-cols-[16rem_1fr] divide-x">
    <AppSidebar />
    
    <!-- Main Content -->
    <div class="bg-slate-100 overflow-y-auto">
      <div class="max-w-4xl mx-auto py-8 px-6">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="mt-1 text-sm text-gray-500">Welcome back, {{ user?.email }}</p>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <NuxtLink
            to="/editor"
            class="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <h3 class="text-lg font-medium text-gray-900">Create New Link</h3>
              <p class="mt-1 text-sm text-gray-500">Create a new biolink or store page</p>
            </div>
            <Icon icon="ph:plus-circle-bold" class="h-8 w-8 text-indigo-600" />
          </NuxtLink>

          <NuxtLink
            to="/analytics"
            class="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <h3 class="text-lg font-medium text-gray-900">View Analytics</h3>
              <p class="mt-1 text-sm text-gray-500">Check your links performance</p>
            </div>
            <Icon icon="ph:chart-line-up-bold" class="h-8 w-8 text-indigo-600" />
          </NuxtLink>
        </div>

        <!-- Recent Links -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900">Recent Links</h2>
            <NuxtLink 
              to="/links"
              class="text-sm text-indigo-600 hover:text-indigo-700"
            >
              View all
            </NuxtLink>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center h-32">
            <div class="flex items-center space-x-2 text-gray-500">
              <Icon icon="ph:circle-notch-bold" class="h-5 w-5 animate-spin" />
              <span>Loading links...</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="recentLinks.length === 0" class="text-center py-8">
            <p class="text-sm text-gray-500">No links created yet</p>
          </div>

          <!-- Links List -->
          <div v-else class="space-y-4">
            <div
              v-for="link in recentLinks"
              :key="link.id"
              class="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div>
                <h3 class="font-medium text-gray-900">
                  {{ link.nickname || 'Untitled Link' }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ shortUrl(link.id) }}
                </p>
              </div>
              <button
                @click="copyLink(link.id)"
                class="p-2 text-gray-400 hover:text-gray-600"
              >
                <Icon icon="ph:copy-bold" class="h-5 w-5" />
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
  id: string
  long_url: string
  nickname?: string
  created_at: string
}

const recentLinks = ref<Link[]>([])
const loading = ref(true)
const origin = ref('')

// Get origin on client-side only
onMounted(() => {
  origin.value = window.location.origin
})

// Generate short URL
const shortUrl = (id: string) => {
  return `${origin.value}/s/${id}`
}

// Fetch recent links on mount
onMounted(async () => {
  try {
    const { data, error } = await client
      .from('short_links')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error
    recentLinks.value = data
  } catch (error) {
    console.error('Error fetching links:', error)
  } finally {
    loading.value = false
  }
})

// Copy link to clipboard
const copyLink = async (id: string) => {
  const url = shortUrl(id)
  await navigator.clipboard.writeText(url)
  alert('Link copied to clipboard!')
}
</script> 