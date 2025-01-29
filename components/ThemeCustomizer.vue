<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Theme Customization</h3>
    
    <!-- Theme Presets -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Theme Presets</label>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="preset in theme.presets"
          :key="preset.id"
          @click="theme.setPreset(preset.id)"
          class="flex items-center px-4 py-2 rounded-md border"
          :class="{'border-indigo-500 bg-indigo-50': preset.id === activePresetId}"
        >
          <div class="w-4 h-4 rounded-full mr-2" :style="{ background: preset.theme.colors.primary }" />
          {{ preset.name }}
        </button>
      </div>
    </div>

    <!-- Color Customization -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Colors</label>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="(color, name) in colorFields" :key="name">
          <label class="block text-sm text-gray-500 mb-1 capitalize">{{ formatColorLabel(name) }}</label>
          <input
            type="color"
            :value="getColorValue(name)"
            @input="e => handleColorChange(name, e.target.value)"
            class="w-full h-8 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>

    <!-- Font Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Fonts</label>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-500 mb-1">Heading Font</label>
          <select
            v-model="theme.current.font.heading"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Body Font</label>
          <select
            v-model="theme.current.font.body"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Layout Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Layout</label>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="layout in layouts"
          :key="layout"
          @click="theme.setLayout(layout)"
          class="flex items-center justify-center px-4 py-2 rounded-md border capitalize"
          :class="{'border-indigo-500 bg-indigo-50': layout === theme.current.layout}"
        >
          {{ layout }}
        </button>
      </div>
    </div>

    <!-- Animation Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Background Animation</label>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="animation in animations"
          :key="animation"
          @click="theme.setAnimation(animation)"
          class="flex items-center justify-center px-4 py-2 rounded-md border capitalize"
          :class="{'border-indigo-500 bg-indigo-50': animation === theme.current.animation}"
        >
          {{ animation }}
        </button>
      </div>
    </div>

    <!-- Branding Toggle -->
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <button
          type="button"
          @click="theme.toggleBranding"
          class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
          :class="theme.current.showBranding ? 'bg-indigo-600' : 'bg-gray-200'"
          role="switch"
          :aria-checked="theme.current.showBranding"
        >
          <span
            aria-hidden="true"
            class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            :class="theme.current.showBranding ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
        <span class="ml-3 text-sm font-medium text-gray-900">Show Branding</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore, type Theme } from '~/stores/theme'
import { computed } from 'vue'

const props = defineProps<{
  template?: string
}>()

const theme = useThemeStore()

const fonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Poppins',
  'Montserrat'
]

const layouts: Theme['layout'][] = ['default', 'centered', 'minimal']
const animations: Theme['animation'][] = ['none', 'gradient']

const activePresetId = computed(() => {
  return theme.presets.find(p => 
    JSON.stringify(p.theme) === JSON.stringify(theme.current)
  )?.id || null
})

const isStoreTemplate = computed(() => props.template === 'store')

const colorFields = computed(() => {
  const fields = {
    primary: true,
    background: true,
    text: true,
    accent: true
  }

  if (isStoreTemplate.value) {
    fields['button.background'] = true
    fields['button.text'] = true
  }

  return fields
})

const formatColorLabel = (name: string) => {
  if (name === 'button.background') return 'Button Background'
  if (name === 'button.text') return 'Button Text'
  return name
}

const getColorValue = (name: string) => {
  if (name === 'button.background') return theme.current.colors.button.background
  if (name === 'button.text') return theme.current.colors.button.text
  return theme.current.colors[name]
}

const handleColorChange = (name: string, value: string) => {
  if (name === 'button.background') {
    theme.setCustomColors({ button: { ...theme.current.colors.button, background: value } })
  } else if (name === 'button.text') {
    theme.setCustomColors({ button: { ...theme.current.colors.button, text: value } })
  } else {
    theme.setCustomColors({ [name]: value })
  }
}
</script> 