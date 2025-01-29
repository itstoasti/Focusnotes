import { ref } from 'vue'

export function useTwitterAuth() {
  // Generate a random string for PKCE code verifier
  const generateCodeVerifier = () => {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    const randomString = Array.from(array)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
    return base64UrlEncode(randomString)
  }

  // Base64Url encode a string
  const base64UrlEncode = (str: string) => {
    const base64 = btoa(str)
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  // Generate code challenge using SHA-256
  const generateCodeChallenge = async (verifier: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)))
    return base64Digest
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  // Generate random state
  const generateState = () => {
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)
    return Array.from(array)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
  }

  const connectTwitter = async () => {
    try {
      console.log('Starting Twitter OAuth 2.0 flow...')

      // Generate and store PKCE values
      const codeVerifier = generateCodeVerifier()
      localStorage.setItem('twitter_code_verifier', codeVerifier)
      console.log('Generated code verifier')

      // Generate code challenge
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      console.log('Generated code challenge')

      // Generate and store state
      const state = generateState()
      localStorage.setItem('twitter_state', state)
      console.log('Generated state')

      // Get client ID from runtime config
      const config = useRuntimeConfig()
      const clientId = config.public.twitterClientId
      if (!clientId) {
        throw new Error('Twitter client ID not configured')
      }

      // Construct authorization URL
      const authUrl = new URL('https://twitter.com/i/oauth2/authorize')
      const params = {
        response_type: 'code',
        client_id: clientId,
        redirect_uri: 'https://socialgathering.io/auth/callback',
        scope: 'tweet.read tweet.write users.read offline.access',
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      }

      // Add parameters to URL
      Object.entries(params).forEach(([key, value]) => {
        authUrl.searchParams.append(key, value)
      })

      const url = authUrl.toString()
      console.log('Redirecting to Twitter:', url)

      // Redirect to Twitter
      window.location.href = url
    } catch (error) {
      console.error('Error starting Twitter OAuth:', error)
      throw error
    }
  }

  return {
    connectTwitter
  }
} 