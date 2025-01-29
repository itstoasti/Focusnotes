<template>
  <div class="h-screen w-full">
    <AppSidebar />
    
    <!-- Main Content -->
    <div class="bg-slate-50 min-h-screen">
      <div class="border-b bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Analytics Grid -->
        <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <!-- Total Clicks -->
          <div class="bg-white rounded-lg border p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Total Clicks</h2>
            <div class="text-3xl font-bold text-gray-900">{{ totalClicks }}</div>
          </div>

          <!-- Click Distribution -->
          <div class="bg-white rounded-lg border p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Click Distribution</h2>
            <div class="space-y-4">
              <div v-for="template in templates" :key="template" class="flex items-center">
                <div class="w-24 capitalize">{{ template }}</div>
                <div class="flex-grow bg-gray-100 rounded-full h-4">
                  <div
                    class="h-full rounded-full"
                    :class="{
                      'bg-green-500': template === 'simple',
                      'bg-blue-500': template === 'store',
                      'bg-purple-500': template === 'blog'
                    }"
                    :style="{ width: `${getTemplatePercentage(template)}%` }"
                  ></div>
                </div>
                <div class="w-16 text-right">{{ getTemplateClicks(template) }}</div>
              </div>
            </div>
          </div>

          <!-- Country Distribution -->
          <div class="bg-white rounded-lg border p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Top Countries</h2>
            <div class="space-y-4">
              <div v-for="(count, country) in topCountries" :key="country" class="flex items-center">
                <div class="w-32 truncate">{{ country }}</div>
                <div class="flex-grow bg-gray-100 rounded-full h-4">
                  <div
                    class="h-full rounded-full bg-indigo-500"
                    :style="{ width: `${(count / totalClicks) * 100}%` }"
                  ></div>
                </div>
                <div class="w-16 text-right">{{ count }}</div>
              </div>
            </div>
          </div>

          <!-- Device & Browser Stats -->
          <div class="bg-white rounded-lg border p-6">
            <div class="space-y-6">
              <!-- Device Stats -->
              <div>
                <h2 class="text-lg font-medium text-gray-900 mb-4">Devices</h2>
                <div class="space-y-4">
                  <div v-for="(count, device) in topDevices" :key="device" class="flex items-center">
                    <div class="w-24">{{ device }}</div>
                    <div class="flex-grow bg-gray-100 rounded-full h-4">
                      <div
                        class="h-full rounded-full bg-orange-500"
                        :style="{ width: `${(count / totalClicks) * 100}%` }"
                      ></div>
                    </div>
                    <div class="w-16 text-right">{{ count }}</div>
                  </div>
                </div>
              </div>

              <!-- Browser Stats -->
              <div>
                <h2 class="text-lg font-medium text-gray-900 mb-4">Browsers</h2>
                <div class="space-y-4">
                  <div v-for="(count, browser) in topBrowsers" :key="browser" class="flex items-center">
                    <div class="w-24">{{ browser }}</div>
                    <div class="flex-grow bg-gray-100 rounded-full h-4">
                      <div
                        class="h-full rounded-full bg-teal-500"
                        :style="{ width: `${(count / totalClicks) * 100}%` }"
                      ></div>
                    </div>
                    <div class="w-16 text-right">{{ count }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Most Clicked Links -->
          <div class="bg-white rounded-lg border p-6 lg:col-span-2">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Most Clicked Links</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="link in sortedLinks" :key="link.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ link.data.n }}</div>
                      <div class="text-sm text-gray-500">{{ `${origin}/s/${link.short_id}` }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                        :class="{
                          'bg-green-100 text-green-800': link.data.template === 'simple',
                          'bg-blue-100 text-blue-800': link.data.template === 'store',
                          'bg-purple-100 text-purple-800': link.data.template === 'blog'
                        }"
                      >
                        {{ link.data.template }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(link.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ link.clicks }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const client = useSupabaseClient()
const user = useSupabaseUser()
const origin = ref(process.client ? window.location.origin : '')

definePageMeta({
  middleware: ['auth']
})

interface Link {
  id: string
  short_id: string
  clicks: number
  created_at: string
  data: {
    n: string
    template: string
    [key: string]: any
  }
}

const links = ref<Link[]>([])
const totalClicks = ref(0)
const templates = ['simple', 'store', 'blog']

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Get template clicks
const getTemplateClicks = (template: string) => {
  return links.value
    .filter(link => link.data.template === template)
    .reduce((sum, link) => sum + (link.clicks || 0), 0)
}

// Get template percentage
const getTemplatePercentage = (template: string) => {
  if (totalClicks.value === 0) return 0
  return (getTemplateClicks(template) / totalClicks.value) * 100
}

// Sort links by clicks
const sortedLinks = computed(() => {
  return [...links.value].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
})

// Analytics data
const topCountries = ref<Record<string, number>>({})
const topDevices = ref<Record<string, number>>({})
const topBrowsers = ref<Record<string, number>>({})
const topReferrers = ref<Record<string, number>>({})

// Update fetchAnalytics function
const fetchAnalytics = async () => {
  console.log('Fetching analytics for user:', user.value?.id)
  
  const { data, error } = await client
    .from('links')
    .select('*')
    .eq('user_id', user.value?.id)
  
  if (error) {
    console.error('Error fetching analytics:', error)
    return
  }
  
  links.value = data
  totalClicks.value = data.reduce((sum, link) => sum + (link.clicks || 0), 0)
  
  // Aggregate analytics data
  const countries: Record<string, number> = {}
  const devices: Record<string, number> = {}
  const browsers: Record<string, number> = {}
  const referrers: Record<string, number> = {}
  
  data.forEach(link => {
    if (link.analytics) {
      // Aggregate countries
      Object.entries(link.analytics.countries || {}).forEach(([country, count]) => {
        countries[country] = (countries[country] || 0) + (count as number)
      })
      
      // Aggregate devices
      Object.entries(link.analytics.devices || {}).forEach(([device, count]) => {
        devices[device] = (devices[device] || 0) + (count as number)
      })
      
      // Aggregate browsers
      Object.entries(link.analytics.browsers || {}).forEach(([browser, count]) => {
        browsers[browser] = (browsers[browser] || 0) + (count as number)
      })
      
      // Aggregate referrers
      Object.entries(link.analytics.referrers || {}).forEach(([referrer, count]) => {
        referrers[referrer] = (referrers[referrer] || 0) + (count as number)
      })
    }
  })
  
  // Sort and limit to top 5
  topCountries.value = Object.fromEntries(
    Object.entries(countries).sort(([,a], [,b]) => b - a).slice(0, 5)
  )
  topDevices.value = Object.fromEntries(
    Object.entries(devices).sort(([,a], [,b]) => b - a).slice(0, 5)
  )
  topBrowsers.value = Object.fromEntries(
    Object.entries(browsers).sort(([,a], [,b]) => b - a).slice(0, 5)
  )
  topReferrers.value = Object.fromEntries(
    Object.entries(referrers).sort(([,a], [,b]) => b - a).slice(0, 5)
  )
  
  console.log('Analytics data:', {
    links: links.value,
    totalClicks: totalClicks.value,
    topCountries: topCountries.value,
    topDevices: topDevices.value,
    topBrowsers: topBrowsers.value,
    topReferrers: topReferrers.value
  })
}

// Fetch data on mount
onMounted(() => {
  fetchAnalytics()
  
  // Refresh every minute
  const interval = setInterval(fetchAnalytics, 60000)
  
  // Clean up interval
  onUnmounted(() => clearInterval(interval))
})
</script> 