export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // If user is not logged in and trying to access a protected route
  if (!user.value && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  // If user is logged in and trying to access login/register pages
  if (user.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/home')
  }

  // If user is logged in and accessing root path, redirect to home
  if (user.value && to.path === '/') {
    return navigateTo('/home')
  }
}) 