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
import { useSupabase } from '~/composables/useSupabase'

const supabase = useSupabase()
const user = ref(null)

// Get current user
const getCurrentUser = async () => {
  const { data: { user: currentUser }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return
  }
  user.value = currentUser
}

onMounted(async () => {
  try {
    await getCurrentUser()
    if (!user.value) {
      throw new Error('No authenticated user')
    }

    console.log('Starting Twitter callback process')
    
    // Get the code and state from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    
    console.log('Received callback parameters')
    
    if (!code) {
      throw new Error('No code provided')
    }

    // Verify state matches
    const savedState = localStorage.getItem('twitter_state')
    if (state !== savedState) {
      throw new Error('State mismatch - possible CSRF attack')
    }

    // Get the code verifier we stored earlier
    const codeVerifier = localStorage.getItem('twitter_code_verifier')
    console.log('Retrieved stored values')
    
    if (!codeVerifier) {
      throw new Error('No code verifier found')
    }

    // Exchange the code for access token
    console.log('Exchanging code for token')
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
    console.log('Token exchange completed')
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to exchange token')
    }

    // Store the Twitter account data in profiles
    console.log('Updating profile')
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        x_account_data: {
          username: data.userData.username,
          name: data.userData.name,
          profile_image_url: data.userData.profile_image_url,
          access_token: data.accessToken,
          refresh_token: data.refreshToken
        }
      })
      .eq('id', user.value.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      throw updateError
    }

    console.log('Twitter account connected successfully')

    // Clean up
    localStorage.removeItem('twitter_code_verifier')
    localStorage.removeItem('twitter_state')

    // Redirect back to settings
    navigateTo('/settings')
  } catch (error) {
    console.error('Error in callback:', error)
    alert('Failed to connect Twitter account')
    navigateTo('/settings')
  }
})
</script> 