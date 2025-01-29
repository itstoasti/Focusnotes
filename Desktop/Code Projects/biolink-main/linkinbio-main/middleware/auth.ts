import { useSupabase } from '~/composables/useSupabase'

export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client-side
  if (process.server) return

  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  // If user is not logged in and trying to access a protected route
  if (!session && to.path !== '/login' && to.path !== '/register' && to.path !== '/auth/callback') {
    return navigateTo('/login')
  }

  // If user is logged in and trying to access login/register pages
  if (session && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/home')
  }

  // If user is logged in and accessing root path, redirect to home
  if (session && to.path === '/') {
    return navigateTo('/home')
  }
}) 