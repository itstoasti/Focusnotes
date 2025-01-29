<template>
  <div class="h-screen w-full">
    <AppSidebar />
    
    <!-- Main Content -->
    <div class="bg-slate-50 min-h-screen">
      <div class="border-b bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-2xl font-bold text-gray-900">My Links</h1>
            <NuxtLink
              to="/editor"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Icon icon="ph:plus-bold" class="h-5 w-5 mr-2" />
              Create New Link
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Links List -->
        <div class="bg-white shadow rounded-lg divide-y">
          <div v-for="link in links" :key="link.id" class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ link.data.n }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ link.data.d }}</p>
                <div class="mt-2 flex items-center space-x-4">
                  <span class="text-sm text-gray-500">
                    {{ formatDate(link.created_at) }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ link.clicks }} clicks
                  </span>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': link.data.template === 'simple',
                      'bg-blue-100 text-blue-800': link.data.template === 'store',
                      'bg-purple-100 text-purple-800': link.data.template === 'blog'
                    }"
                  >
                    {{ link.data.template }}
                  </span>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <button
                  @click="editLink(link)"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Icon icon="ph:pencil-bold" class="h-5 w-5 mr-2" />
                  Edit
                </button>
                <button
                  @click="copyLink(link.short_id)"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Icon icon="ph:link-bold" class="h-5 w-5 mr-2" />
                  Copy Link
                </button>
                <button
                  @click="deleteLink(link.id)"
                  class="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <Icon icon="ph:trash-bold" class="h-5 w-5 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Links Message -->
        <div v-if="links.length === 0" class="text-center py-12">
          <Icon icon="ph:link-break-bold" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No links</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new link.</p>
          <div class="mt-6">
            <NuxtLink
              to="/editor"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Icon icon="ph:plus-bold" class="h-5 w-5 mr-2" />
              Create New Link
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useShortLinkStore } from '~/stores/shortLinks'

const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

definePageMeta({
  middleware: ['auth']
})

// Get all links for the current user
const links = ref([])
const fetchLinks = async () => {
  const userId = user.value?.id
  console.log('Current user ID:', userId)
  
  if (!userId) {
    console.log('No user ID found, user might not be logged in')
    return
  }
  
  console.log('Fetching links for user:', userId)
  
  const { data, error } = await client
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching links:', error.message)
    return
  }
  
  console.log('Fetched links:', data)
  links.value = data || []
}

// Load links on mount and when user changes
watch(() => user.value?.id, (newId) => {
  console.log('User ID changed:', newId)
  if (newId) {
    fetchLinks()
  }
})

onMounted(() => {
  if (user.value?.id) {
    fetchLinks()
  }
})

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Edit link
const editLink = (link) => {
  // Navigate to editor with link data
  router.push({
    path: '/editor',
    query: { edit: link.id }
  })
}

// Copy link
const copyLink = (shortId: string) => {
  const url = `${window.location.origin}/s/${shortId}`
  navigator.clipboard.writeText(url).then(() => {
    alert('Link copied to clipboard!')
  })
}

// Delete link
const deleteLink = async (id: string) => {
  if (!confirm('Are you sure you want to delete this link?')) return
  
  const { error } = await client
    .from('links')
    .delete()
    .match({ id })
  
  if (error) {
    console.error('Error deleting link:', error)
    alert('Error deleting link')
    return
  }
  
  // Refresh links list
  fetchLinks()
}
</script> 