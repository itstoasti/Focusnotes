<template>
  <div class="min-h-screen bg-gray-50">
    <AppSidebar />
    
    <div class="lg:pl-64">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Content Calendar</h1>
          
          <!-- Calendar Header -->
          <div class="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <div class="flex items-center space-x-4">
              <button class="p-2 hover:bg-gray-100 rounded-full">
                <Icon icon="ph:caret-left-bold" class="w-5 h-5" />
              </button>
              <h2 class="text-lg font-semibold">{{ currentMonth }}</h2>
              <button class="p-2 hover:bg-gray-100 rounded-full">
                <Icon icon="ph:caret-right-bold" class="w-5 h-5" />
              </button>
            </div>
            <div class="flex space-x-2">
              <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2">
                <Icon icon="ph:plus-bold" class="w-4 h-4" />
                <span>New Post</span>
              </button>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
            <!-- Day headers -->
            <template v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">
              <div class="hidden md:block text-center font-medium text-gray-500 py-2">
                {{ day }}
              </div>
            </template>

            <!-- Calendar days -->
            <template v-for="i in 31" :key="i">
              <div 
                class="bg-gray-50 rounded-lg p-4 min-h-[120px] relative hover:bg-gray-100 transition-colors"
                :class="{'opacity-50': i > 28}"
              >
                <span class="absolute top-2 left-2 text-sm text-gray-500">{{ i }}</span>
                
                <!-- Example scheduled post -->
                <div v-if="i === 15" class="mt-6">
                  <div class="bg-blue-100 text-blue-800 p-2 rounded-md text-sm">
                    <div class="font-medium">Twitter Post</div>
                    <div class="text-xs">2:30 PM</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const currentMonth = computed(() => {
  return new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
})
</script>

<style scoped>
/* Add any custom styles here */
</style> 