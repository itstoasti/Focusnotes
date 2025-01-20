<template>
  <base-form-section
    title="Template"
    description="Choose a template for your page"
  >
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <!-- Simple Template -->
      <div
        class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
        :class="modelValue === 'simple' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300'"
        @click="$emit('update:modelValue', 'simple')"
      >
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center">
            <div class="text-sm">
              <p class="font-medium text-gray-900">Simple</p>
              <div class="text-gray-500">
                <p class="sm:inline">Basic link list template</p>
              </div>
            </div>
          </div>
          <Icon
            v-if="modelValue === 'simple'"
            name="ph:check-circle-fill"
            class="h-5 w-5 text-indigo-600"
          />
        </div>
      </div>

      <!-- Store Template -->
      <div
        class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
        :class="modelValue === 'store' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300'"
        @click="$emit('update:modelValue', 'store')"
      >
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center">
            <div class="text-sm">
              <p class="font-medium text-gray-900">Store</p>
              <div class="text-gray-500">
                <p class="sm:inline">Product showcase template</p>
              </div>
            </div>
          </div>
          <Icon
            v-if="modelValue === 'store'"
            name="ph:check-circle-fill"
            class="h-5 w-5 text-indigo-600"
          />
        </div>
      </div>

      <!-- Blog Template -->
      <div
        class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
        :class="modelValue === 'blog' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300'"
        @click="$emit('update:modelValue', 'blog')"
      >
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center">
            <div class="text-sm">
              <p class="font-medium text-gray-900">Blog</p>
              <div class="text-gray-500">
                <p class="sm:inline">Blog posts template</p>
              </div>
            </div>
          </div>
          <Icon
            v-if="modelValue === 'blog'"
            name="ph:check-circle-fill"
            class="h-5 w-5 text-indigo-600"
          />
        </div>
      </div>
    </div>
  </base-form-section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  modelValue: 'simple' | 'store' | 'blog'
}

defineProps<Props>()
defineEmits(['update:modelValue'])
</script> 