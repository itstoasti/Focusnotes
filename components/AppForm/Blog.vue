<template>
  <base-form-section title="Blog Posts" description="Write and manage your blog posts">
    <div class="space-y-6">
      <!-- Add New Post Button -->
      <button
        @click="addPost"
        class="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50"
      >
        <Icon icon="ph:plus-circle-bold" class="h-5 w-5 mr-2" />
        Add New Post
      </button>

      <!-- Blog Posts List -->
      <TransitionGroup name="list" tag="div" class="space-y-6">
        <div
          v-for="(post, index) in modelValue"
          :key="index"
          class="bg-white rounded-lg border shadow-sm"
        >
          <!-- Post Header -->
          <div class="p-4 border-b bg-gray-50 flex items-center justify-between">
            <div class="flex-grow">
              <input
                type="text"
                v-model="post.l"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter post title"
              />
            </div>
            <div class="flex items-center space-x-2 ml-4">
              <button
                @click="toggleMinimize(index)"
                class="text-gray-400 hover:text-gray-600"
              >
                <Icon 
                  :icon="minimizedPosts[index] ? 'ph:arrows-out-line-horizontal' : 'ph:arrows-in-line-horizontal'" 
                  class="h-5 w-5"
                />
              </button>
              <button
                @click="removePost(index)"
                class="text-red-400 hover:text-red-600"
              >
                <Icon icon="ph:trash" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Post Content -->
          <div v-show="!minimizedPosts[index]" class="p-4 space-y-4">
            <!-- Featured Image -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <input
                type="url"
                v-model="post.img"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <!-- Post Content -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                v-model="post.content"
                rows="6"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Write your blog post content here..."
              ></textarea>
            </div>

            <!-- Short Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea
                v-model="post.description"
                rows="2"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Write a brief description of your post..."
              ></textarea>
            </div>

            <!-- Publishing Options -->
            <div class="flex items-center justify-between pt-4 border-t">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :id="'published-' + index"
                  v-model="post.published"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label :for="'published-' + index" class="ml-2 block text-sm text-gray-900">Published</label>
              </div>
              <div class="text-sm text-gray-500">
                Last updated: {{ formatDate(post.updatedAt || new Date()) }}
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </base-form-section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

interface BlogPost {
  l: string // title
  img?: string // featured image
  content: string // main blog content
  description: string // short description
  published: boolean
  updatedAt: Date
  id: string
}

interface Props {
  modelValue: BlogPost[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const minimizedPosts = ref<{ [key: number]: boolean }>({})

const toggleMinimize = (index: number) => {
  minimizedPosts.value[index] = !minimizedPosts.value[index]
}

const addPost = () => {
  const newPost: BlogPost = {
    l: '',
    img: '',
    content: '',
    description: '',
    published: false,
    updatedAt: new Date(),
    id: Date.now().toString()
  }
  emit('update:modelValue', [...props.modelValue || [], newPost])
}

const removePost = (index: number) => {
  const newPosts = [...props.modelValue]
  newPosts.splice(index, 1)
  emit('update:modelValue', newPosts)
  // Clean up minimized state
  delete minimizedPosts.value[index]
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

// Add watcher to ensure modelValue is initialized
watch(() => props.modelValue, (newVal) => {
  if (!newVal || !Array.isArray(newVal)) {
    emit('update:modelValue', [])
  }
}, { immediate: true })
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style> 