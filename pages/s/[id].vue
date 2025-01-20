<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div v-if="error" class="text-center">
      <h1 class="text-2xl font-bold text-gray-900">Link not found</h1>
      <p class="mt-2 text-gray-600">The link you're looking for doesn't exist or has been removed.</p>
    </div>
    <div v-else-if="isLoading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Redirecting...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { encodeData } from '~/utils/transformer'

const route = useRoute()
const client = useSupabaseClient()
const error = ref(false)
const isLoading = ref(true)

onMounted(async () => {
  try {
    // Get the link data
    const { data: linkData, error: fetchError } = await client
      .from('links')
      .select('*')
      .eq('short_id', route.params.id)
      .single()

    if (fetchError || !linkData) {
      console.error('Error fetching link:', fetchError)
      error.value = true
      return
    }

    console.log('Found link:', linkData)

    try {
      // Get country info from IP
      const countryResponse = await fetch('https://ipapi.co/json/')
      const countryData = await countryResponse.json()
      const country = countryData.country_name || 'Unknown'

      // Get browser and device info
      const userAgent = navigator.userAgent
      const browser = getBrowser(userAgent)
      const device = getDevice(userAgent)
      const referrer = document.referrer || 'Direct'

      // Prepare analytics data
      const currentAnalytics = linkData.analytics || {
        countries: {},
        browsers: {},
        devices: {},
        referrers: {}
      }

      // Increment counts
      currentAnalytics.countries[country] = (currentAnalytics.countries[country] || 0) + 1
      currentAnalytics.browsers[browser] = (currentAnalytics.browsers[browser] || 0) + 1
      currentAnalytics.devices[device] = (currentAnalytics.devices[device] || 0) + 1
      currentAnalytics.referrers[referrer] = (currentAnalytics.referrers[referrer] || 0) + 1

      const updatedClicks = (linkData.clicks || 0) + 1

      console.log('Updating link with:', {
        short_id: route.params.id,
        clicks: updatedClicks,
        analytics: currentAnalytics
      })

      // Update link with new analytics and increment clicks
      const { error: updateError } = await client
        .from('links')
        .update({
          clicks: updatedClicks,
          analytics: currentAnalytics
        })
        .eq('short_id', route.params.id)

      if (updateError) {
        console.error('Error updating analytics:', updateError)
        // Log the full error for debugging
        console.log('Full update error:', updateError)
      } else {
        console.log('Successfully updated analytics')
      }
    } catch (analyticsError) {
      console.error('Error tracking analytics:', analyticsError)
      // Continue with redirect even if analytics fails
    }

    // Redirect to the full URL
    if (linkData.data) {
      const encodedData = encodeData(linkData.data)
      navigateTo(`/view/${route.params.id}?data=${encodedData}`)
    } else {
      error.value = true
    }
  } catch (err) {
    console.error('Error processing link:', err)
    error.value = true
  } finally {
    isLoading.value = false
  }
})

// Helper functions to parse user agent
function getBrowser(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'Other'
}

function getDevice(userAgent: string): string {
  if (userAgent.includes('Mobile')) return 'Mobile'
  if (userAgent.includes('Tablet')) return 'Tablet'
  return 'Desktop'
}
</script> 