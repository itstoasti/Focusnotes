<template>
  <div class="h-full">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-medium text-gray-900">Preview</h2>
      <button
        @click="$emit('publish')"
        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
      >
        Publish
      </button>
    </div>

    <div class="relative h-[calc(100vh-10rem)] w-full overflow-hidden rounded-lg border bg-gray-100">
      <div class="absolute inset-0 overflow-auto">
        <component
          :is="data.template === 'store' ? TemplateStore : data.template === 'blog' ? TemplateBlog : TemplateSimple"
          :data="data"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TemplateSimple from '~/components/Templates/Simple.vue'
import TemplateStore from '~/components/Templates/Store.vue'
import TemplateBlog from '~/components/Templates/Blog.vue'

interface Link {
  l: string
  u: string
  i?: string
  img?: string
  price?: string
  description?: string
}

interface Props {
  data: {
    n: string
    d: string
    i: string
    f: string
    t: string
    ig: string
    gh: string
    tg: string
    l: string
    e: string
    w: string
    y: string
    ls: Link[]
    template: 'simple' | 'store' | 'blog'
  }
}

defineProps<Props>()
defineEmits(['publish'])
</script> 