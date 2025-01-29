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
        redirect: false,
        cookieOptions: {
            name: 'sb',
            lifetime: 60 * 60 * 8,
            domain: '',
            path: '/',
            sameSite: 'lax'
        },
        clientOptions: {
            auth: {
                flowType: 'pkce',
                detectSessionInUrl: false,
                persistSession: true,
                autoRefreshToken: true
            }
        }
    },
    runtimeConfig: {
        // Private keys are only available on the server
        twitterClientSecret: process.env.TWITTER_CLIENT_SECRET,
        // Public keys that are exposed to the client
        public: {
            twitterClientId: process.env.TWITTER_CLIENT_ID
        }
    }
})
