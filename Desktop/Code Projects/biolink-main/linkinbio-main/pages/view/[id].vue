<template>
  <div class="min-h-screen" :style="getThemeStyles()">
    <ThemeProvider v-if="data" :style="getThemeStyles(data.theme)">
      <component :is="getTemplate()" :data="data" :theme="data.theme" />
    </ThemeProvider>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { decodeData } from '~/utils/transformer'
import TemplateSimple from '~/components/Templates/Simple.vue'
import TemplateStore from '~/components/Templates/Store.vue'
import TemplateBlog from '~/components/Templates/Blog.vue'

const route = useRoute()
const data = ref<any>(null)

// Get the appropriate template component
const getTemplate = () => {
  if (!data.value?.template) return TemplateSimple
  
  switch (data.value.template) {
    case 'store':
      return TemplateStore
    case 'blog':
      return TemplateBlog
    default:
      return TemplateSimple
  }
}

// Get theme styles
const getThemeStyles = () => {
  if (!data.value?.theme) return {}
  
  const theme = data.value.theme
  console.log('Applying theme styles:', theme)
  
  return {
    '--color-primary': theme.colors.primary,
    '--color-background': theme.colors.background,
    '--color-text': theme.colors.text,
    '--color-accent': theme.colors.accent,
    '--font-heading': theme.font.heading,
    '--font-body': theme.font.body,
    backgroundColor: theme.colors.background,
    color: theme.colors.text
  }
}

onMounted(() => {
  try {
    const decodedData = decodeData(route.query.data as string)
    data.value = decodedData
    console.log('Decoded data:', decodedData)
  } catch (error) {
    console.error('Error decoding data:', error)
  }
})
</script> 