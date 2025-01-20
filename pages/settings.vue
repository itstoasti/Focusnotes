<template>
  <div class="h-screen w-full">
    <AppSidebar />
    
    <!-- Main Content -->
    <div class="bg-slate-50 min-h-screen">
      <!-- Header -->
      <div class="border-b bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg border p-6 space-y-6">
          <!-- Account Settings -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <div class="mt-1 text-sm text-gray-500">{{ user?.email }}</div>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="pt-6 border-t">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Default Template</label>
                  <p class="mt-1 text-sm text-gray-500">Choose your default template for new links</p>
                </div>
                <select
                  v-model="defaultTemplate"
                  class="mt-1 block w-1/3 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="simple">Simple</option>
                  <option value="store">Store</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Subscription Section -->
          <div class="pt-6 border-t">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Subscription</h2>
            <div v-if="isLoading" class="text-sm text-gray-500">
              Loading subscription details...
            </div>
            <div v-else class="space-y-4">
              <div v-if="subscription?.status === 'active'" class="bg-green-50 p-4 rounded-lg">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <Icon icon="ph:check-circle-duotone" class="h-5 w-5 text-green-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">
                      Active Pro Subscription
                    </h3>
                    <div class="mt-2 text-sm text-green-700">
                      <p>You have access to all premium features.</p>
                    </div>
                    <div class="mt-4">
                      <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        @click="handleCancel"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="bg-white p-4 rounded-lg border">
                <h3 class="text-lg font-medium text-gray-900">Upgrade to Pro</h3>
                <p class="mt-2 text-sm text-gray-500">
                  Get access to premium features including:
                </p>
                <ul class="mt-4 space-y-2">
                  <li class="flex items-center text-sm text-gray-500">
                    <Icon icon="ph:check-circle-duotone" class="h-5 w-5 text-green-400 mr-2" />
                    Custom domain support
                  </li>
                  <li class="flex items-center text-sm text-gray-500">
                    <Icon icon="ph:check-circle-duotone" class="h-5 w-5 text-green-400 mr-2" />
                    Advanced analytics
                  </li>
                  <li class="flex items-center text-sm text-gray-500">
                    <Icon icon="ph:check-circle-duotone" class="h-5 w-5 text-green-400 mr-2" />
                    Priority support
                  </li>
                </ul>
                <div class="mt-6">
                  <button
                    type="button"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    @click="handleSubscribe('pro')"
                  >
                    Upgrade Now - $9/month
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-6 border-t">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Actions</h2>
            <div class="space-y-4">
              <button
                @click="logout"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                <Icon icon="ph:sign-out-bold" class="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'

// Auth
const client = useSupabaseClient()
const user = useSupabaseUser()

// Define middleware
definePageMeta({
  middleware: ['auth']
})

// Default template preference
const defaultTemplate = ref<'simple' | 'store'>('simple')
const subscription = ref(null)
const isLoading = ref(true)

// Fetch subscription status
const fetchSubscription = async () => {
  try {
    const { data, error } = await client
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.value?.id)
      .single()

    if (error) throw error
    subscription.value = data
  } catch (err) {
    console.error('Error fetching subscription:', err)
  } finally {
    isLoading.value = false
  }
}

// Subscribe to Pro plan
const handleSubscribe = async (plan: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await client.auth.getSession().then(res => res.data.session?.access_token)}`,
      },
      body: JSON.stringify({ plan }),
    })

    const { url } = await response.json()
    window.location.href = url
  } catch (err) {
    console.error('Error creating checkout session:', err)
  }
}

// Cancel subscription
const handleCancel = async () => {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await client.auth.getSession().then(res => res.data.session?.access_token)}`,
      },
    })

    if (!response.ok) throw new Error('Failed to cancel subscription')
    await fetchSubscription()
  } catch (err) {
    console.error('Error canceling subscription:', err)
  }
}

// Sign out function
const logout = async () => {
  const { error } = await client.auth.signOut()
  if (!error) {
    navigateTo('/login')
  }
}

onMounted(() => {
  fetchSubscription()
})
</script> 