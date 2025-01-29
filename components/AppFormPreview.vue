<template>
  <component :is="selectedTemplate" :data="data" />
</template>

<script setup lang="ts">
import Simple from '~/components/Templates/Simple.vue'
import Store from '~/components/Templates/Store.vue'
import Blog from '~/components/Templates/Blog.vue'

const props = defineProps<{
  data: {
    template: string
    [key: string]: any
  }
}>()

const selectedTemplate = computed(() => {
  switch (props.data.template) {
    case 'store':
      return Store
    case 'blog':
      return Blog
    case 'simple':
    default:
      return Simple
  }
})
</script> 