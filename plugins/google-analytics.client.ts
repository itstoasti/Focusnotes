declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  window.dataLayer = window.dataLayer || []
  window.gtag = function(...args) {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', 'G-V7ZWQBZJ4N')

  useHead({
    script: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-V7ZWQBZJ4N',
        async: true
      }
    ]
  })
}) 
