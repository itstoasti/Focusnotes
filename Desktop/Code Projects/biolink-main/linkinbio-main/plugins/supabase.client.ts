import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // Disable Supabase OAuth providers
  const supabase = useSupabaseClient()
  if (supabase.auth) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in via email/password')
      }
    })
  }
}) 