import { ref } from 'vue'

export function useTwitterAuth() {
  const generateCodeVerifier = () => {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('')
  }

  const generateCodeChallenge = async (verifier: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  const connectX = async () => {
    try {
      console.log('Starting Twitter OAuth flow...')
      
      // Generate and store PKCE values
      const codeVerifier = generateCodeVerifier()
      localStorage.setItem('twitter_code_verifier', codeVerifier)
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      console.log('Generated PKCE values:', { codeVerifier: !!codeVerifier, codeChallenge: !!codeChallenge })

      // Generate random state
      const state = generateCodeVerifier()
      localStorage.setItem('twitter_state', state)
      console.log('Generated state:', { state: !!state })

      // Get runtime config
      const config = useRuntimeConfig()
      const clientId = config.public.twitterClientId
      console.log('Client ID:', clientId) // Log the actual client ID for debugging

      if (!clientId) {
        throw new Error('Twitter client ID not configured')
      }

      // Construct Twitter OAuth URL
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: 'https://socialgathering.io/auth/callback',
        scope: 'tweet.read tweet.write users.read offline.access',
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      })

      const url = `https://twitter.com/i/oauth2/authorize?${params.toString()}`
      console.log('Redirecting to Twitter OAuth URL:', url)

      // Use window.location.replace to prevent browser history issues
      window.location.replace(url)
    } catch (error) {
      console.error('Error initiating Twitter OAuth:', error)
      throw error
    }
  }

  return {
    connectX
  }
} 