<template>
  <div class="h-screen grid place-items-center">
    <div
      class="h-[729px] w-[340px] rounded-[3rem] overflow-hidden bg-white"
      :class="[
        theme.current.colors.background === '#1F2937' ? 'ring-8 ring-white/20' : 'ring-8 ring-slate-800'
      ]"
    >
      <div 
        class="h-full"
        :class="{ 
          'overflow-y-auto scrollbar-hide': props.data.template === 'simple',
          'overflow-y-scroll scrollbar-hide': props.data.template === 'store'
        }"
      >
        <ThemeProvider class="h-full">
          <component :is="selectedTemplate" :data="data" />
        </ThemeProvider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Simple from '~/components/Templates/Simple.vue'
import Store from '~/components/Templates/Store.vue'
import { useThemeStore } from '~/stores/theme'

const theme = useThemeStore()

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

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>
