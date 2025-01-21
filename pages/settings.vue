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
            <h2 class="text-lg font-medium text-gray-900 mb-4">Connected Accounts</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Icon icon="mdi:twitter" class="h-6 w-6 text-blue-400" />
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">X (Twitter)</h3>
                    <p class="text-sm text-gray-500" v-if="!xAccount">Connect your X account to enable posting</p>
                    <p class="text-sm text-gray-500" v-else>Connected as @{{ xAccount.username }}</p>
                  </div>
                </div>
                <button
                  v-if="!xAccount"
                  @click="connectX"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Connect
                </button>
                <button
                  v-else
                  @click="disconnectX"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Disconnect
                </button>
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
                      <p v-if="subscription.details?.current_period_end" class="mt-1">
                        Next billing date: {{ new Date(subscription.details.current_period_end).toLocaleDateString() }}
                      </p>
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
              <div v-else-if="subscription?.status === 'canceling'" class="bg-yellow-50 p-4 rounded-lg">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <Icon icon="ph:info-duotone" class="h-5 w-5 text-yellow-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">
                      Subscription Canceling
                    </h3>
                    <div class="mt-2 text-sm text-yellow-700">
                      <p>Your subscription will remain active until the end of the billing period.</p>
                      <p v-if="subscription.details?.current_period_end" class="mt-1 font-medium">
                        Access ends: {{ new Date(subscription.details.current_period_end).toLocaleDateString() }}
                      </p>
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
const subscription = ref<{ status: string; details: any } | null>(null)
const isLoading = ref(true)
const xAccount = ref<{ username: string } | null>(null)

// Fetch subscription status
const fetchSubscription = async () => {
  console.log('Fetching subscription for user:', user.value?.id)
  try {
    // Check profiles table for subscription status
    const { data: profileData, error: profileError } = await client
      .from('profiles')
      .select('subscription_status, stripe_customer_id')
      .eq('id', user.value?.id)
      .single()

    console.log('Profile data:', profileData)
    console.log('Profile error:', profileError)

    if (profileError) {
      console.error('Profile error:', profileError)
      return
    }

    // Check subscriptions table for detailed subscription info
    const { data: subscriptionData, error: subscriptionError } = await client
      .from('subscriptions')
      .select('*, stripe_subscription_id, current_period_end')
      .eq('user_id', user.value?.id)
      .in('status', ['active', 'canceling'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    console.log('Raw subscription data:', subscriptionData)
    console.log('Subscription error:', subscriptionError)

    // Set subscription status and details
    let status = profileData?.subscription_status || 'inactive'
    let details = null

    if (subscriptionData) {
      details = {
        ...subscriptionData,
        current_period_end: subscriptionData.current_period_end
      }
      // If subscription is marked as canceling, override the status
      if (subscriptionData.status === 'canceling') {
        status = 'canceling'
      }
    }

    subscription.value = { status, details }
    console.log('Final subscription value:', subscription.value)
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
    console.log('Starting subscription cancellation...');
    const token = await client.auth.getSession().then(res => res.data.session?.access_token);
    console.log('Got auth token:', !!token);
    
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Cancel subscription response status:', response.status);
    const responseData = await response.json();
    console.log('Cancel subscription response:', responseData);

    if (!response.ok) throw new Error(responseData.message || 'Failed to cancel subscription');
    await fetchSubscription();
  } catch (err) {
    console.error('Error canceling subscription:', err);
  }
}

// Sign out function
const logout = async () => {
  const { error } = await client.auth.signOut()
  if (!error) {
    navigateTo('/login')
  }
}

// Function to connect X account
const connectX = async () => {
  try {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: 'https://socialgathering.io/settings',
        scopes: 'tweet.read tweet.write users.read'
      }
    })
    if (error) {
      console.error('OAuth error:', error)
      throw error
    }
    if (data?.url) {
      window.location.href = data.url
    }
  } catch (err) {
    console.error('Error connecting X account:', err)
  }
}

// Function to disconnect X account
const disconnectX = async () => {
  try {
    const { error } = await client
      .from('profiles')
      .update({ x_account_data: null })
      .eq('id', user.value?.id)

    if (error) throw error
    xAccount.value = null
  } catch (err) {
    console.error('Error disconnecting X account:', err)
  }
}

// Function to fetch X account details
const fetchXAccount = async () => {
  try {
    const { data, error } = await client
      .from('profiles')
      .select('x_account_data')
      .eq('id', user.value?.id)
      .single()

    if (error) throw error
    if (data?.x_account_data) {
      xAccount.value = data.x_account_data
    }
  } catch (err) {
    console.error('Error fetching X account:', err)
  }
}

onMounted(() => {
  fetchSubscription()
  fetchXAccount()
})
</script> 