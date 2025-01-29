import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  function updateBreakpoints() {
    const width = window.innerWidth
    isMobile.value = width < 640
    isTablet.value = width >= 640 && width < 1024
    isDesktop.value = width >= 1024
  }

  onMounted(() => {
    updateBreakpoints()
    window.addEventListener('resize', updateBreakpoints)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateBreakpoints)
  })

  return {
    isMobile,
    isTablet,
    isDesktop
  }
} 