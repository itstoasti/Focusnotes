import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { code, codeVerifier } = body

    console.log('Received token exchange request:', { code, hasVerifier: !!codeVerifier })

    // Exchange the code for access token
    const tokenResponse = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID!,
        client_secret: process.env.TWITTER_CLIENT_SECRET!,
        redirect_uri: 'https://socialgathering.io/auth/callback',
        code_verifier: codeVerifier
      })
    })

    const tokenData = await tokenResponse.json()
    console.log('Token exchange response:', tokenData)
    
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error || 'Failed to get access token')
    }

    // Get user info
    const userResponse = await fetch('https://api.x.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })

    const userData = await userResponse.json()
    console.log('User data response:', userData)

    return { 
      success: true,
      userData: userData.data,
      accessToken: tokenData.access_token
    }
  } catch (error: any) {
    console.error('Error in Twitter callback:', error)
    return { 
      success: false, 
      error: error.message 
    }
  }
}) 