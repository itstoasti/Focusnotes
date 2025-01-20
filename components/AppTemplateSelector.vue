<template>
  <div class="space-y-4">
    <h2 class="text-lg font-medium text-gray-900">Choose Template</h2>
    <div class="grid grid-cols-2 gap-4 max-w-lg">
      <!-- Simple Template -->
      <button
        @click="selectTemplate('simple')"
        class="relative aspect-[4/5] rounded-lg border-2 overflow-hidden hover:border-indigo-500 transition-colors"
        :class="modelValue === 'simple' ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2' : 'border-gray-200'"
      >
        <div class="absolute inset-0 bg-white">
          <div class="p-3 space-y-2">
            <div class="w-12 h-12 mx-auto rounded-full bg-gray-100"></div>
            <div class="h-3 w-20 mx-auto bg-gray-100 rounded"></div>
            <div class="h-2 w-24 mx-auto bg-gray-100 rounded"></div>
            <div class="pt-3 space-y-2">
              <div class="h-6 bg-gray-100 rounded"></div>
              <div class="h-6 bg-gray-100 rounded"></div>
              <div class="h-6 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
        <div class="absolute bottom-2 inset-x-0 text-center text-sm font-medium text-gray-900">
          Simple Links
        </div>
      </button>

      <!-- Store Template -->
      <button
        @click="selectTemplate('store')"
        class="relative aspect-[4/5] rounded-lg border-2 overflow-hidden hover:border-indigo-500 transition-colors"
        :class="modelValue === 'store' ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2' : 'border-gray-200'"
      >
        <div class="absolute inset-0 bg-white">
          <div class="p-3 space-y-2">
            <div class="w-12 h-12 mx-auto rounded-full bg-gray-100"></div>
            <div class="h-3 w-20 mx-auto bg-gray-100 rounded"></div>
            <div class="h-2 w-24 mx-auto bg-gray-100 rounded"></div>
            <div class="pt-3 grid grid-cols-2 gap-1">
              <div>
                <div class="aspect-square bg-gray-100 rounded mb-1"></div>
                <div class="h-2 bg-gray-100 rounded"></div>
              </div>
              <div>
                <div class="aspect-square bg-gray-100 rounded mb-1"></div>
                <div class="h-2 bg-gray-100 rounded"></div>
              </div>
              <div>
                <div class="aspect-square bg-gray-100 rounded mb-1"></div>
                <div class="h-2 bg-gray-100 rounded"></div>
              </div>
              <div>
                <div class="aspect-square bg-gray-100 rounded mb-1"></div>
                <div class="h-2 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute bottom-2 inset-x-0 text-center text-sm font-medium text-gray-900">
          Store Products
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: 'simple' | 'store'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'simple' | 'store'): void
}>()

const selectTemplate = (template: 'simple' | 'store') => {
  console.log('[AppTemplateSelector] Selecting template:', template)
  console.log('[AppTemplateSelector] Template type:', typeof template)
  console.log('[AppTemplateSelector] Raw template value:', JSON.stringify(template))
  emit('update:modelValue', template)
}
</script> 