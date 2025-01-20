<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p class="mt-2 text-sm text-gray-600">Track your bio link performance and visitor statistics</p>
          </div>
          <NuxtLink 
            to="/editor" 
            class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          >
            <icon name="ph:arrow-left-bold" class="mr-2 h-4 w-4" />
            Back to Editor
          </NuxtLink>
        </div>
      </div>

      <!-- Overview Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <icon name="ph:chart-line-up-bold" class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ analytics.totalViews }}</div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <icon name="ph:arrow-up-bold" class="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span class="ml-1">{{ viewsGrowth }}%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <icon name="ph:mouse-simple-bold" class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Clicks</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ analytics.totalClicks }}</div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <icon name="ph:arrow-up-bold" class="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span class="ml-1">{{ clicksGrowth }}%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <icon name="ph:users-bold" class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Unique Visitors</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ analytics.totalUniqueVisitors }}</div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <icon name="ph:arrow-up-bold" class="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span class="ml-1">{{ visitorsGrowth }}%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Views Over Time</h3>
            <div class="h-[300px]">
              <Line :data="viewsChartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Top Links</h3>
            <div class="h-[300px]">
              <Bar :data="clicksChartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Views by Country</h3>
            <div class="h-[300px]">
              <Bar :data="countryChartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h3>
            <div class="h-[300px]">
              <Bar :data="referrerChartData" :options="chartOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useAnalyticsStore } from '~/stores/analytics'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const analytics = useAnalyticsStore()

// Fetch analytics data on component mount
onMounted(() => {
  analytics.fetchAnalytics()
})

// Calculate growth percentages (mock data for now)
const viewsGrowth = computed(() => 12)
const clicksGrowth = computed(() => 8)
const visitorsGrowth = computed(() => 4)

const formatUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    // Return just the pathname, or the hostname if it's a different domain
    return urlObj.hostname === window.location.hostname 
      ? urlObj.pathname.slice(1, 20) + (urlObj.pathname.length > 20 ? '...' : '')
      : urlObj.hostname
  } catch {
    // If URL parsing fails, return a truncated version of the original string
    return url.slice(0, 20) + (url.length > 20 ? '...' : '')
  }
}

const formatReferrer = (referrer: string): string => {
  if (!referrer || referrer === 'Direct') return 'Direct'
  try {
    const urlObj = new URL(referrer)
    return urlObj.hostname
  } catch {
    return referrer
  }
}

interface ChartDataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string
  tension?: number
}

interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

// Create chart data from analytics store
const viewsChartData = computed<ChartData>(() => ({
  labels: analytics.viewsByDay.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
  datasets: [{
    label: 'Views',
    data: analytics.viewsByDay.map(d => d.count),
    borderColor: '#6366F1',
    tension: 0.4
  }]
}))

const clicksChartData = computed<ChartData>(() => {
  // Debug log
  console.log('Top links data:', analytics.topLinks)

  const labels = analytics.topLinks.map(l => {
    const formatted = formatUrl(l.linkId)
    console.log('Formatted URL:', l.linkId, '->', formatted)
    return formatted
  })

  return {
    labels,
    datasets: [{
      label: 'Clicks',
      data: analytics.topLinks.map(l => l.count),
      backgroundColor: '#818CF8'
    }]
  }
})

const countryChartData = computed<ChartData>(() => {
  // Debug log
  console.log('Country data:', analytics.viewsByCountry)

  return {
    labels: analytics.viewsByCountry.map(c => c.country || 'Unknown'),
    datasets: [{
      label: 'Views',
      data: analytics.viewsByCountry.map(c => c.count),
      backgroundColor: '#10B981'
    }]
  }
})

const referrerChartData = computed<ChartData>(() => {
  // Debug log
  console.log('Referrer data:', analytics.viewsByReferrer)

  return {
    labels: analytics.viewsByReferrer.map(r => formatReferrer(r.referrer)),
    datasets: [{
      label: 'Views',
      data: analytics.viewsByReferrer.map(r => r.count),
      backgroundColor: '#F59E0B'
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: { raw: number; dataset: { label: string } }) => {
          const value = context.raw || 0
          return `${value} ${context.dataset.label}`
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    }
  }
}
</script> 