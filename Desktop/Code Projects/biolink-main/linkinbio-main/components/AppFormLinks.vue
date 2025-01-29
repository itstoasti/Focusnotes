<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-medium text-gray-900">Links</h2>
        <p class="mt-1 text-sm text-gray-500">
          Icon keys can be found at
          <a href="https://icones.js.org" target="_blank" class="text-indigo-600 hover:text-indigo-500">icones.js.org</a>
        </p>
      </div>
      <button
        type="button"
        @click="addLink"
        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
      >
        Add Link
      </button>
    </div>

    <div v-if="modelValue.length === 0" class="text-center py-4 text-gray-500">
      No links added yet
    </div>

    <TransitionGroup v-else name="list" tag="div" class="space-y-4">
      <div
        v-for="(link, index) in modelValue"
        :key="index"
        class="bg-gray-50 rounded-lg p-4 relative group"
        draggable="true"
        @dragstart="dragStart($event, index)"
        @dragend="dragEnd"
        @dragover.prevent
        @dragenter="dragEnter($event, index)"
        :class="{ 'dragging': draggedItem === index, 'drag-over': dragOverItem === index }"
      >
        <!-- Drag Handle and Header Row -->
        <div class="flex items-center space-x-3 mb-4">
          <div class="opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
            <Icon icon="ph:dots-six-vertical-bold" class="h-5 w-5 text-gray-400" />
          </div>
          
          <div class="flex-grow">
            <input
              type="text"
              v-model="link.l"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter link label"
            />
          </div>

          <div class="flex items-center space-x-2">
            <button
              type="button"
              @click="toggleMinimize(index)"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon 
                :icon="minimizedLinks[index] ? 'ph:arrows-out-line-horizontal' : 'ph:arrows-in-line-horizontal'" 
                class="h-5 w-5"
              />
            </button>
            <button
              type="button"
              @click="removeLink(index)"
              class="text-red-400 hover:text-red-600"
            >
              <Icon icon="ph:trash" class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Expandable Content -->
        <div v-show="!minimizedLinks[index]" class="space-y-4 pt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="text"
              v-model="link.u"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter link URL"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Icon key (optional)</label>
            <input
              type="text"
              v-model="link.i"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter icon key (e.g. ph:link-simple)"
            />
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

interface Link {
  l: string
  u: string
  i?: string
}

const props = defineProps<{
  modelValue: Link[]
}>()

const emit = defineEmits(['update:modelValue'])

const draggedItem = ref<number | null>(null)
const dragOverItem = ref<number | null>(null)
const minimizedLinks = ref<{ [key: number]: boolean }>({})

const addLink = () => {
  const newLink: Link = {
    l: '',
    u: '',
    i: ''
  }
  emit('update:modelValue', [...props.modelValue, newLink])
}

const removeLink = (index: number) => {
  const newLinks = [...props.modelValue]
  newLinks.splice(index, 1)
  emit('update:modelValue', newLinks)
  // Clean up minimized state
  delete minimizedLinks.value[index]
}

const toggleMinimize = (index: number) => {
  minimizedLinks.value[index] = !minimizedLinks.value[index]
}

const dragStart = (e: DragEvent, index: number) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    draggedItem.value = index
  }
}

const dragEnter = (e: DragEvent, index: number) => {
  if (draggedItem.value === index) return
  dragOverItem.value = index
}

const dragEnd = () => {
  if (draggedItem.value !== null && dragOverItem.value !== null && draggedItem.value !== dragOverItem.value) {
    const newLinks = [...props.modelValue]
    const [movedItem] = newLinks.splice(draggedItem.value, 1)
    newLinks.splice(dragOverItem.value, 0, movedItem)
    
    // Update minimized states
    const newMinimizedLinks: { [key: number]: boolean } = {}
    Object.keys(minimizedLinks.value).forEach(key => {
      const oldIndex = parseInt(key)
      let newIndex = oldIndex
      if (oldIndex === draggedItem.value) {
        newIndex = dragOverItem.value
      } else if (oldIndex > draggedItem.value && oldIndex <= dragOverItem.value) {
        newIndex = oldIndex - 1
      } else if (oldIndex < draggedItem.value && oldIndex >= dragOverItem.value) {
        newIndex = oldIndex + 1
      }
      newMinimizedLinks[newIndex] = minimizedLinks.value[oldIndex]
    })
    minimizedLinks.value = newMinimizedLinks
    
    emit('update:modelValue', newLinks)
  }
  draggedItem.value = null
  dragOverItem.value = null
}
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

.dragging {
  opacity: 0.5;
  background: #f3f4f6;
}

.drag-over {
  border-top: 2px solid #6366f1;
}
</style> 