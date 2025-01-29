import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { code, codeVerifier } = body

    console.log('=== Starting Twitter Auth Process ===')
    console.log('Received parameters:', {
      hasCode: !!code,
      hasCodeVerifier: !!codeVerifier
    })

    const config = useRuntimeConfig()
    const clientId = config.twitterClientId?.trim()
    const clientSecret = config.twitterClientSecret?.trim()

    console.log('Checking credentials:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret
    })

    if (!clientId || !clientSecret) {
      throw new Error('Twitter credentials not configured')
    }

    // Create Basic auth token
    const credentials = `${clientId}:${clientSecret}`
    const encodedCredentials = btoa(credentials)
    console.log('Basic Auth token created')

    // Exchange the code for access token
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://socialgathering.io/auth/callback',
      code_verifier: codeVerifier,
      client_id: clientId
    })

    console.log('Making token request...')
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    console.log('Token response status:', tokenResponse.status)
    const responseText = await tokenResponse.text()
    console.log('Token response:', responseText)

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${responseText}`)
    }

    const tokenData = JSON.parse(responseText)

    // Get user info
    console.log('Fetching user information...')
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })

    const userResponseText = await userResponse.text()
    console.log('User response:', userResponseText)

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user information: ${userResponseText}`)
    }

    const userData = JSON.parse(userResponseText)
    if (!userData.data) {
      throw new Error('Invalid user data received from Twitter')
    }

    return { 
      success: true,
      userData: userData.data,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token
    }
  } catch (error: any) {
    console.error('Error in Twitter callback:', error)
    return { 
      success: false, 
      error: error.message 
    }
  }
}) 