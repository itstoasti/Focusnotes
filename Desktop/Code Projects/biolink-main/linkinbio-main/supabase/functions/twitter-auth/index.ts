// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from Functions!")

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the code and state from the request URL
    const url = new URL(req.url)
    console.log('Received callback URL:', url.toString())
    
    // For Twitter OAuth, we need to handle the callback differently
    if (url.pathname === '/auth/v1/callback') {
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')

      if (!code) {
        console.error('No code provided in callback')
        throw new Error('No code provided')
      }

      // Create Supabase client
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_ANON_KEY') || '',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
          }
        }
      )
      console.log('Supabase client created')

      // Exchange the code for OAuth tokens
      const { data: { user }, error: authError } = await supabaseClient.auth.exchangeCodeForSession(code)
      
      if (authError) {
        throw authError
      }

      if (!user) {
        throw new Error('No user data received')
      }

      // Store Twitter account data in profiles
      if (user.app_metadata?.provider === 'twitter') {
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({
            x_account_data: {
              username: user.user_metadata?.user_name,
              name: user.user_metadata?.full_name,
              avatar_url: user.user_metadata?.avatar_url
            }
          })
          .eq('id', user.id)

        if (updateError) {
          throw updateError
        }
      }

      // Redirect back to the settings page
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          Location: 'https://socialgathering.io/settings'
        }
      })
    }

    // If not a callback, return 404
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/twitter-auth' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
