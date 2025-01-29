<template>
  <div 
    class="theme-root h-full"
    :class="[theme.current.animation ? `animation-${theme.current.animation}` : '']"
    :style="{
      '--color-primary': theme.current.colors.primary,
      '--color-background': theme.current.colors.background,
      '--color-text': theme.current.colors.text,
      '--color-accent': theme.current.colors.accent,
      '--font-heading': theme.current.font.heading,
      '--font-body': theme.current.font.body,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '~/stores/theme'

const theme = useThemeStore()
</script>

<style>
/* Theme styles for the preview container */
.theme-root {
  isolation: isolate;
  background-color: var(--color-background);
}

/* Theme styles for the preview content */
.theme-root .app-form-preview {
  color: var(--color-text);
}

.theme-root .app-form-preview h1,
.theme-root .app-form-preview h2,
.theme-root .app-form-preview h3,
.theme-root .app-form-preview h4,
.theme-root .app-form-preview h5,
.theme-root .app-form-preview h6 {
  font-family: var(--font-heading);
}

.theme-root .app-form-preview * {
  font-family: var(--font-body);
}

/* Animation */
.animation-gradient {
  background: linear-gradient(-45deg, var(--color-primary), var(--color-accent));
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style> 