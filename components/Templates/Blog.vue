<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="py-16 text-center" :style="headerStyle">
      <img 
        :src="data.i" 
        :alt="data.n"
        class="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4"
        :style="{ borderColor: theme.colors.primary }"
      >
      <h1 class="text-3xl font-bold mb-2" :style="{ color: theme.colors.text }">{{ data.n }}</h1>
      <p class="text-lg mb-6" :style="{ color: theme.colors.text }">{{ data.d }}</p>
      
      <!-- Social Links -->
      <div class="flex justify-center space-x-4">
        <a v-if="data.t" :href="data.t" target="_blank" class="hover:opacity-75">
          <Icon icon="ph:twitter-logo-fill" class="w-6 h-6" :style="{ color: theme.colors.primary }" />
        </a>
        <a v-if="data.f" :href="data.f" target="_blank" class="hover:opacity-75">
          <Icon icon="ph:facebook-logo-fill" class="w-6 h-6" :style="{ color: theme.colors.primary }" />
        </a>
        <a v-if="data.ig" :href="data.ig" target="_blank" class="hover:opacity-75">
          <Icon icon="ph:instagram-logo-fill" class="w-6 h-6" :style="{ color: theme.colors.primary }" />
        </a>
        <a v-if="data.gh" :href="data.gh" target="_blank" class="hover:opacity-75">
          <Icon icon="ph:github-logo-fill" class="w-6 h-6" :style="{ color: theme.colors.primary }" />
        </a>
      </div>
    </header>

    <!-- Blog Posts -->
    <main class="max-w-4xl mx-auto px-4 pb-16">
      <!-- View Toggle -->
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold" :style="{ color: theme.colors.text }">Latest Posts</h2>
        <div class="flex items-center space-x-2">
          <button
            @click="viewMode = 'list'"
            class="p-2 rounded-lg"
            :class="viewMode === 'list' ? 'bg-opacity-10' : 'text-gray-500 hover:text-gray-700'"
            :style="viewMode === 'list' ? { 
              color: theme.colors.primary,
              backgroundColor: `${theme.colors.primary}22`
            } : {}"
          >
            <Icon icon="ph:list-bold" class="h-5 w-5" />
          </button>
          <button
            @click="viewMode = 'grid'"
            class="p-2 rounded-lg"
            :class="viewMode === 'grid' ? 'bg-opacity-10' : 'text-gray-500 hover:text-gray-700'"
            :style="viewMode === 'grid' ? { 
              color: theme.colors.primary,
              backgroundColor: `${theme.colors.primary}22`
            } : {}"
          >
            <Icon icon="ph:grid-four-bold" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div v-if="publishedPosts.length === 0" class="text-center py-8">
        <p class="text-lg" :style="{ color: theme.colors.text }">No published posts yet.</p>
      </div>
      
      <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-2 gap-8' : 'space-y-8'">
        <article 
          v-for="post in publishedPosts" 
          :key="post.l" 
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          :class="viewMode === 'grid' ? '' : 'flex gap-6'"
          @click="selectedPost = post"
        >
          <img 
            v-if="post.img" 
            :src="post.img" 
            :alt="post.l"
            class="object-cover"
            :class="viewMode === 'grid' ? 'w-full h-48' : 'w-48 h-48'"
          >
          <div class="p-6 flex flex-col flex-grow">
            <h2 class="text-xl font-bold mb-2" :style="{ color: theme.colors.text }">{{ post.l }}</h2>
            <p class="text-lg mb-4 line-clamp-2" :style="{ color: theme.colors.text }">{{ post.description }}</p>
            <div class="mt-auto flex items-center justify-between">
              <div class="text-sm" :style="{ color: `${theme.colors.text}99` }">
                {{ formatDate(post.updatedAt) }}
              </div>
              <button
                class="text-sm font-medium"
                :style="{ color: theme.colors.primary }"
              >
                Read More
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Post Modal -->
      <div 
        v-if="selectedPost" 
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click.self="selectedPost = null"
      >
        <div 
          class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          :style="{ backgroundColor: theme.colors.background }"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-2xl font-bold" :style="{ color: theme.colors.text }">{{ selectedPost.l }}</h2>
              <button 
                @click="selectedPost = null"
                class="text-gray-500 hover:text-gray-700"
              >
                <Icon icon="ph:x-bold" class="h-6 w-6" />
              </button>
            </div>
            
            <img
              v-if="selectedPost.img"
              :src="selectedPost.img"
              :alt="selectedPost.l"
              class="w-full h-64 object-cover rounded-lg mb-6"
            />
            
            <div class="prose max-w-none" v-html="selectedPost.content" :style="{ color: theme.colors.text }"></div>
            
            <div class="mt-6 text-sm" :style="{ color: `${theme.colors.text}99` }">
              Last updated: {{ formatDate(selectedPost.updatedAt) }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  data: any
  theme: any
}>()

// View mode state
const viewMode = ref<'list' | 'grid'>('grid')
const selectedPost = ref<any>(null)

// Computed properties
const publishedPosts = computed(() => {
  return props.data.ls?.filter((post: any) => post.published) || []
})

// Header gradient style
const headerStyle = computed(() => ({
  background: `linear-gradient(to bottom, ${props.theme.colors.primary}22, ${props.theme.colors.background})`
}))

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 