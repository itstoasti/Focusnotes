<template>
  <component :is="selectedTemplate" :data="data" />
</template>

<script setup lang="ts">
import Simple from '~/components/Templates/Simple.vue'
import Store from '~/components/Templates/Store.vue'

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
    case 'simple':
    default:
      return Simple
  }
})
</script> 