<template>
  <div class="relative">
    <!-- Toggle button -->
    <button
      @click="isOpen = !isOpen"
      class="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50"
      :class="{ 'left-64': isOpen }"
    >
      <Icon 
        :icon="isOpen ? 'ph:x-bold' : 'ph:list-bold'" 
        class="h-5 w-5 text-gray-600"
      />
    </button>

    <!-- Sidebar -->
    <div
      class="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40"
      :class="{ '-translate-x-full': !isOpen }"
    >
      <div class="flex flex-col h-full">
        <!-- Menu items -->
        <div class="p-4 pt-16 flex-1">
          <h2 class="text-lg font-semibold text-gray-900 px-2">Menu</h2>
          
          <div class="space-y-2 mt-4">
            <NuxtLink
              to="/home"
              class="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              <Icon icon="ph:house-bold" class="h-5 w-5" />
              <span>Home</span>
            </NuxtLink>

            <NuxtLink
              to="/editor"
              class="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              <Icon icon="ph:pencil-bold" class="h-5 w-5" />
              <span>Editor</span>
            </NuxtLink>

            <NuxtLink
              to="/links"
              class="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              <Icon icon="ph:link-bold" class="h-5 w-5" />
              <span>My Links</span>
            </NuxtLink>

            <NuxtLink
              to="/analytics"
              class="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              <Icon icon="ph:chart-line-up-bold" class="h-5 w-5" />
              <span>Analytics</span>
            </NuxtLink>

            <NuxtLink
              to="/settings"
              class="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              <Icon icon="ph:gear-six-bold" class="h-5 w-5" />
              <span>Settings</span>
            </NuxtLink>
          </div>
        </div>

        <!-- User profile section -->
        <div class="p-4 border-t">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Icon icon="ph:user" class="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ user?.email }}
              </p>
              <button
                @click="handleLogout"
                class="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
              >
                <Icon icon="ph:sign-out" class="h-3 w-3" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 bg-black bg-opacity-20 z-30"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineEmits(['prefill', 'publish'])
const isOpen = ref(false)

// Auth
const client = useSupabaseClient()
const user = useSupabaseUser()

const handleLogout = async () => {
  const { error } = await client.auth.signOut()
  if (error) {
    alert(error.message)
  } else {
    navigateTo('/login')
  }
}
</script> 