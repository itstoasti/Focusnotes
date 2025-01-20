<template>
  <div class="h-screen w-full">
    <AppSidebar />
    
    <!-- Main Content -->
    <div class="bg-slate-50 min-h-screen">
      <!-- Header -->
      <div class="border-b bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg border p-6 space-y-6">
          <!-- Account Settings -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <div class="mt-1 text-sm text-gray-500">{{ user?.email }}</div>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="pt-6 border-t">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Default Template</label>
                  <p class="mt-1 text-sm text-gray-500">Choose your default template for new links</p>
                </div>
                <select
                  v-model="defaultTemplate"
                  class="mt-1 block w-1/3 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="simple">Simple</option>
                  <option value="store">Store</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-6 border-t">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Actions</h2>
            <div class="space-y-4">
              <button
                @click="logout"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                <Icon icon="ph:sign-out-bold" class="h-5 w-5 mr-2" />
                Sign Out
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

// Default template preference
const defaultTemplate = ref<'simple' | 'store'>('simple')

// Sign out function
const logout = async () => {
  const { error } = await client.auth.signOut()
  if (!error) {
    navigateTo('/login')
  }
}
</script> 