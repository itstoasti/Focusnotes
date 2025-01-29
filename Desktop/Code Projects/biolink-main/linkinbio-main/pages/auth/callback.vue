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
    // Get the code from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    
    if (!code) {
      throw new Error('No code provided')
    }

    // Get the code verifier we stored earlier
    const codeVerifier = localStorage.getItem('twitter_code_verifier')
    if (!codeVerifier) {
      throw new Error('No code verifier found')
    }

    // Exchange the code for access token
    const tokenResponse = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID || '',
        redirect_uri: 'https://socialgathering.io/auth/callback',
        code_verifier: codeVerifier
      })
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error || 'Failed to get access token')
    }

    // Get user info using the access token
    const userResponse = await fetch('https://api.x.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })

    const userData = await userResponse.json()

    // Store the Twitter account data in profiles
    const { error: updateError } = await client
      .from('profiles')
      .update({
        x_account_data: {
          username: userData.data.username,
          name: userData.data.name,
          avatar_url: userData.data.profile_image_url
        }
      })
      .eq('id', client.auth.user()?.id)

    if (updateError) {
      throw updateError
    }

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