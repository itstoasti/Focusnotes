<template>
  <div class="h-screen w-full grid grid-cols-[16rem_1fr] divide-x">
    <AppSidebar />
    
    <!-- Main Content -->
    <div class="bg-slate-100 overflow-y-auto">
      <div class="max-w-4xl mx-auto py-8 px-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">My Links</h1>
            <p class="mt-1 text-sm text-gray-500">Manage your shortened links</p>
          </div>
          <NuxtLink
            to="/editor"
            class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Icon icon="ph:plus-bold" class="h-4 w-4 mr-2" />
            Create New Link
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="flex items-center space-x-2 text-gray-500">
            <Icon icon="ph:circle-notch-bold" class="h-5 w-5 animate-spin" />
            <span>Loading links...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="links.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <Icon icon="ph:link-break-bold" class="h-6 w-6 text-indigo-600" />
          </div>
          <h3 class="mt-4 text-sm font-medium text-gray-900">No links yet</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating your first link</p>
          <div class="mt-6">
            <NuxtLink
              to="/editor"
              class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <Icon icon="ph:plus-bold" class="h-4 w-4 mr-2" />
              Create New Link
            </NuxtLink>
          </div>
        </div>

        <!-- Links Grid -->
        <div v-else class="grid gap-4">
          <div
            v-for="link in links"
            :key="link.id"
            class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div class="space-y-4">
              <!-- Link Info -->
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3 flex-1">
                    <h2 class="text-lg font-medium text-gray-900">
                      {{ link.nickname || 'Untitled Link' }}
                    </h2>
                    <button
                      @click="editNickname(link)"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <Icon icon="ph:pencil-simple-bold" class="h-4 w-4" />
                    </button>
                  </div>
                  <span class="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {{ new Date(link.created_at).toLocaleDateString() }}
                  </span>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500">
                  <Icon icon="ph:link-bold" class="h-4 w-4 mr-2" />
                  {{ shortUrl(link.id) }}
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-4 pt-4 border-t">
                <a
                  :href="shortUrl(link.id)"
                  target="_blank"
                  class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Icon icon="ph:arrow-square-out-bold" class="h-4 w-4 mr-1" />
                  Open Link
                </a>
                <button
                  @click="copyLink(link.id)"
                  class="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
                >
                  <Icon icon="ph:copy-bold" class="h-4 w-4 mr-1" />
                  Copy URL
                </button>
                <button
                  @click="deleteLink(link.id)"
                  class="inline-flex items-center text-sm text-red-600 hover:text-red-700 ml-auto"
                >
                  <Icon icon="ph:trash-bold" class="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
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

const links = ref<Link[]>([])
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

// Fetch links on mount
onMounted(async () => {
  try {
    const { data, error } = await client
      .from('short_links')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    links.value = data
  } catch (error) {
    console.error('Error fetching links:', error)
  } finally {
    loading.value = false
  }
})

// Edit nickname
const editNickname = async (link: Link) => {
  const nickname = prompt('Enter a nickname for this link:', link.nickname)
  if (nickname === null) return // User cancelled
  if (nickname.trim() === '') {
    alert('Nickname cannot be empty')
    return
  }
  
  try {
    const { data, error } = await client
      .from('short_links')
      .update({ nickname: nickname.trim() })
      .eq('id', link.id)
      .select()

    if (error) throw error

    // Update local state with the returned data
    const index = links.value.findIndex(l => l.id === link.id)
    if (index !== -1 && data?.[0]) {
      links.value[index] = data[0]
    }
  } catch (error) {
    console.error('Error updating nickname:', error)
    alert('Failed to update nickname. Please try again.')
  }
}

// Copy link to clipboard
const copyLink = async (id: string) => {
  const url = shortUrl(id)
  await navigator.clipboard.writeText(url)
  alert('Link copied to clipboard!')
}

// Delete link
const deleteLink = async (id: string) => {
  if (!confirm('Are you sure you want to delete this link?')) return

  try {
    const { error } = await client
      .from('short_links')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Remove link from local state
    links.value = links.value.filter(link => link.id !== id)
  } catch (error) {
    console.error('Error deleting link:', error)
    alert('Failed to delete link. Please try again.')
  }
}
</script> 