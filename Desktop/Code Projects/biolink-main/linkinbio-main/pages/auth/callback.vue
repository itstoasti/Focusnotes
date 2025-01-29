<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h2 class="text-lg font-medium text-gray-900">Connecting your account...</h2>
      <p class="mt-2 text-sm text-gray-500">Please wait while we finish setting up your connection.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
const client = useSupabaseClient()

onMounted(async () => {
  try {
    console.log('Starting Twitter callback process')
    
    // Get the code from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    
    console.log('Received callback parameters:', { code: !!code, state })
    
    if (!code) {
      throw new Error('No code provided')
    }

    // Get the code verifier we stored earlier
    const codeVerifier = localStorage.getItem('twitter_code_verifier')
    console.log('Retrieved code verifier:', !!codeVerifier)
    
    if (!codeVerifier) {
      throw new Error('No code verifier found')
    }

    // Exchange the code for access token using our server endpoint
    console.log('Calling token exchange endpoint')
    const response = await fetch('/api/twitter-callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        codeVerifier
      })
    })

    const data = await response.json()
    console.log('Token exchange response:', data)
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to exchange token')
    }

    // Store the Twitter account data in profiles
    console.log('Updating profile with Twitter data')
    const { error: updateError } = await client
      .from('profiles')
      .update({
        x_account_data: {
          username: data.userData.username,
          name: data.userData.name,
          avatar_url: data.userData.profile_image_url
        }
      })
      .eq('id', client.auth.user()?.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      throw updateError
    }

    console.log('Successfully connected Twitter account')

    // Clean up
    localStorage.removeItem('twitter_code_verifier')

    // Redirect back to settings
    navigateTo('/settings')
  } catch (error) {
    console.error('Error in callback:', error)
    alert('Failed to connect Twitter account')
    navigateTo('/settings')
  }
})
</script> 