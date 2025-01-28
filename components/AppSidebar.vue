<template>
  <div class="relative">
    <!-- Toggle button -->
    <button
      @click="isOpen = !isOpen"
      class="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 lg:hidden"
    >
      <Icon 
        :icon="isOpen ? 'ph:x-bold' : 'ph:list-bold'" 
        class="h-5 w-5 text-gray-600"
      />
    </button>

    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        @click="isOpen = false"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <Transition name="slide">
      <div
        v-show="isOpen || isDesktop"
        class="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-40 overflow-y-auto"
      >
        <div class="flex flex-col h-full">
          <!-- Menu items -->
          <div class="p-4 pt-16 flex-1">
            <h2 class="text-lg font-semibold text-gray-900 px-2">Menu</h2>
            
            <div class="space-y-2 mt-4">
              <NuxtLink
                v-for="item in menuItems"
                :key="item.to"
                :to="item.to"
                class="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === item.to }"
                @click="isMobile && (isOpen = false)"
              >
                <Icon :icon="item.icon" class="h-5 w-5" />
                <span>{{ item.label }}</span>
              </NuxtLink>

              <!-- Admin Link (only shown to admins) -->
              <NuxtLink
                v-if="isAdmin"
                to="/admin"
                class="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === '/admin' }"
                @click="isMobile && (isOpen = false)"
              >
                <Icon icon="ph:shield-duotone" class="h-5 w-5" />
                <span>Admin</span>
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
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
const route = useRoute()
const client = useSupabaseClient()

const isOpen = ref(false)
const { isMobile, isDesktop } = useResponsive()

// Menu items
const menuItems = [
  { to: '/home', icon: 'ph:house-bold', label: 'Home' },
  { to: '/content-calendar', icon: 'ph:calendar-bold', label: 'Content Calendar' },
  { to: '/editor', icon: 'ph:pencil-bold', label: 'Link Editor' },
  { to: '/links', icon: 'ph:link-bold', label: 'My Links' },
  { to: '/analytics', icon: 'ph:chart-line-up-bold', label: 'Analytics' },
  { to: '/settings', icon: 'ph:gear-six-bold', label: 'Settings' },
]

// Auth
const user = useSupabaseUser()
const isAdmin = ref(false)

onMounted(async () => {
  if (!user.value) return;
  
  try {
    const { data, error } = await client.rpc('is_admin')
    if (error) {
      console.error('Error checking admin status:', error)
      return
    }
    isAdmin.value = !!data
  } catch (e) {
    console.error('Error in admin check:', e)
  }
})

const handleLogout = async () => {
  const { error } = await client.auth.signOut()
  if (error) {
    alert(error.message)
  } else {
    navigateTo('/login')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style> 