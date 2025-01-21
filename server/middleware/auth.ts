import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data: { session }, error } = await client.auth.getSession()

  if (session?.user?.id) {
    try {
      // Get the user's data
      const { data: { user } } = await client.auth.getUser()
      
      if (user?.app_metadata?.provider === 'twitter') {
        // Store Twitter account data in profiles
        await client
          .from('profiles')
          .update({
            x_account_data: {
              username: user.user_metadata?.user_name,
              name: user.user_metadata?.full_name,
              avatar_url: user.user_metadata?.avatar_url
            }
          })
          .eq('id', session.user.id)
      }
    } catch (err) {
      console.error('Error storing Twitter account data:', err)
    }
  }
}) 