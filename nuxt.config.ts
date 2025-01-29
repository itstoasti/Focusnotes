// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        'nuxt-icon',
        '@vueuse/nuxt',
        '@nuxtjs/supabase',
        '@pinia/nuxt'
    ],
    build: {
        transpile: ["@headlessui/vue", 'vue-chartjs', 'chart.js'],
    },
    experimental: {
        payloadExtraction: false
    },
    nitro: {
        esbuild: {
            options: {
                target: 'esnext'
            }
        }
    },
    supabase: {
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            exclude: ['/*'],
        }
    }
})
