<template>
  <div class="min-h-screen bg-gray-50">
    <AppSidebar />
    <div class="bg-slate-50 min-h-screen">
      <div class="border-b bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <Icon icon="ph:users-duotone" class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">{{ totalUsers }}</div>
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
                  <Icon icon="ph:link-duotone" class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Links</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">{{ totalLinks }}</div>
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
                  <Icon icon="ph:hand-pointing-duotone" class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Clicks</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">{{ totalClicks }}</div>
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
                  <Icon icon="ph:crown-duotone" class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Pro Users</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">{{ proUsers }}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="mt-8">
          <h2 class="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div class="mt-4 bg-white shadow rounded-lg">
            <div class="p-6">
              <ul class="divide-y divide-gray-200">
                <li v-for="activity in recentActivity" :key="activity.id" class="py-4">
                  <div class="flex space-x-3">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">
                        {{ activity.user }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ activity.action }}
                      </p>
                    </div>
                    <time class="text-sm text-gray-500">{{ activity.time }}</time>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Management Tools -->
        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- User Management -->
          <div class="bg-white shadow rounded-lg">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900">User Management</h3>
              <div class="mt-4">
                <div class="flex flex-col">
                  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                          <thead class="bg-gray-50">
                            <tr>
                              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="users.length === 0">
                              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                                No users found
                              </td>
                            </tr>
                            <tr v-for="user in users" :key="user.id">
                              <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ user.email }}</div>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                  :class="{
                                    'bg-green-100 text-green-800': user.status === 'active',
                                    'bg-red-100 text-red-800': user.status === 'suspended',
                                    'bg-blue-100 text-blue-800': user.status === 'admin'
                                  }">
                                  {{ user.status }}
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ user.created_at }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button 
                                  v-if="user.status !== 'admin'"
                                  @click="toggleUserStatus(user.id)" 
                                  class="text-indigo-600 hover:text-indigo-900"
                                >
                                  {{ user.status === 'active' ? 'Suspend' : 'Activate' }}
                                </button>
                                <span v-else class="text-gray-400">Admin</span>
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
          </div>
          
          <!-- System Status -->
          <div class="bg-white shadow rounded-lg">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900">System Status</h3>
              <div class="mt-4 space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Server Status</span>
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Operational
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Database Status</span>
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Healthy
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Storage Usage</span>
                  <div class="flex items-center">
                    <div class="w-48 h-2 bg-gray-200 rounded-full mr-2">
                      <div class="h-2 bg-indigo-600 rounded-full" :style="{ width: '35%' }"></div>
                    </div>
                    <span class="text-sm text-gray-500">35%</span>
                  </div>
                </div>
              </div>
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

definePageMeta({
  middleware: ['auth']
})

const client = useSupabaseClient()
const user = useSupabaseUser()

// Stats
const totalUsers = ref(0)
const totalLinks = ref(0)
const totalClicks = ref(0)
const proUsers = ref(0)

// Users list
const users = ref([])
const recentActivity = ref([])

// Check if user is admin
const isAdmin = ref(false)

// Fetch users data
const fetchUsers = async () => {
  console.log('Fetching users...')
  try {
    const { data: userData, error: usersError } = await client.rpc('get_users')
    
    if (usersError) throw usersError
    
    if (!userData) {
      console.log('No users found')
      users.value = []
      return
    }
    
    console.log('Users data:', userData)
    
    users.value = userData.map(u => ({
      id: u.id,
      email: u.email,
      status: u.is_admin ? 'admin' : u.active ? 'active' : 'suspended',
      created_at: new Date(u.created_at).toLocaleDateString()
    }))
    
    console.log('Processed users:', users.value)
  } catch (error) {
    console.error('Error fetching users:', error)
    users.value = []
  }
}

// Fetch recent activity
const fetchRecentActivity = async () => {
  console.log('Fetching recent activity...')
  
  // Get recent links
  const { data: linkData, error: linkError } = await client
    .from('links')
    .select('id, created_at, data, user_id')
    .order('created_at', { ascending: false })
    .limit(5)
  
  if (linkError) {
    console.error('Error fetching activity:', linkError)
    return
  }

  // If no links found, set empty array
  if (!linkData || linkData.length === 0) {
    recentActivity.value = []
    return
  }

  console.log('Link data:', linkData)

  // Get user emails
  const { data: userData } = await client.rpc('get_users')
  console.log('User data:', userData)
  
  // Create user map
  const userMap = {}
  if (userData) {
    userData.forEach(user => {
      userMap[user.id] = user.email
    })
  }
  console.log('User map:', userMap)
  
  recentActivity.value = linkData.map(item => {
    const userEmail = userMap[item.user_id]
    console.log('Mapping activity:', { linkId: item.id, userId: item.user_id, email: userEmail })
    return {
      id: item.id,
      user: userEmail || 'Unknown user',
      action: `Created link "${item.data?.n || 'Untitled'}"`,
      time: new Date(item.created_at).toLocaleString()
    }
  })

  console.log('Recent activity:', recentActivity.value)
}

onMounted(async () => {
  // Check admin status
  const { data: adminData } = await client.rpc('is_admin')
  isAdmin.value = adminData
  console.log('Is admin:', isAdmin.value)

  if (!isAdmin.value) {
    navigateTo('/home')
    return
  }

  // Fetch stats
  const { data: userCount, error: userError } = await client.rpc('get_user_count')
  console.log('User count:', userCount, 'Error:', userError)
  if (!userError) {
    totalUsers.value = userCount || 0
  }

  const { count: linkCount } = await client.from('links').select('*', { count: 'exact' })
  totalLinks.value = linkCount || 0

  const { data: clickData } = await client.from('links').select('clicks').gt('clicks', 0)
  totalClicks.value = clickData?.reduce((sum, link) => sum + link.clicks, 0) || 0

  // Fetch users and activity
  await fetchUsers()
  await fetchRecentActivity()
})

// Toggle user status
const toggleUserStatus = async (userId: string) => {
  const userToUpdate = users.value.find(u => u.id === userId)
  if (!userToUpdate) return
  
  try {
    const { error } = await client.rpc('toggle_user_status', { user_id: userId })
    if (error) throw error
    
    // Update local state immediately for better UX
    userToUpdate.status = userToUpdate.status === 'active' ? 'suspended' : 'active'
    
    // Then refresh the full list
    await fetchUsers()
  } catch (error) {
    console.error('Error toggling user status:', error)
    alert('Failed to update user status')
  }
}
</script> 