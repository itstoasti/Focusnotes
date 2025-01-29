<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-2xl font-bold text-indigo-600">biolink</span>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/login"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Log in
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="bg-indigo-600 text-white hover:bg-indigo-500 px-4 py-2 rounded-full text-sm font-medium"
            >
              Get Started Free
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-12 lg:gap-16">
          <!-- Text Content -->
          <div class="lg:col-span-6">
            <div class="max-w-2xl">
              <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Create a stunning bio link in minutes
              </h1>
              <p class="mt-6 text-lg leading-8 text-gray-600">
                Share your content, products, and social media links all in one beautiful page. Choose from stunning templates and customize your page to match your brand.
              </p>
              <div class="mt-10 flex items-center gap-x-6">
                <NuxtLink
                  to="/register"
                  class="bg-indigo-600 text-white hover:bg-indigo-500 px-8 py-4 rounded-full text-lg font-semibold"
                >
                  Create Your Bio Link
                </NuxtLink>
              </div>
              <!-- Features List -->
              <div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0">
                    <Icon icon="ph:check-circle-fill" class="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Beautiful Templates</h3>
                    <p class="mt-2 text-gray-600">Choose from our collection of professionally designed templates.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0">
                    <Icon icon="ph:check-circle-fill" class="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Easy Customization</h3>
                    <p class="mt-2 text-gray-600">Personalize colors, fonts, and layout to match your style.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0">
                    <Icon icon="ph:check-circle-fill" class="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Analytics & Insights</h3>
                    <p class="mt-2 text-gray-600">Track clicks and understand your audience better.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0">
                    <Icon icon="ph:check-circle-fill" class="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Blog & Store Support</h3>
                    <p class="mt-2 text-gray-600">Share your content and products effortlessly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Preview Image -->
          <div class="mt-16 lg:mt-0 lg:col-span-6">
            <div class="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-xl p-8">
              <!-- Phone Mockup -->
              <div class="relative mx-auto w-[280px] h-[560px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-900">
                <!-- Screen Content -->
                <div class="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                  <div class="h-full w-full bg-gradient-to-b from-indigo-100 to-white p-4">
                    <!-- Profile Section -->
                    <div class="flex flex-col items-center pt-8">
                      <div class="w-20 h-20 rounded-full bg-indigo-200"></div>
                      <div class="mt-4 w-32 h-4 bg-gray-200 rounded"></div>
                      <div class="mt-2 w-48 h-3 bg-gray-100 rounded"></div>
                    </div>
                    <!-- Links Section -->
                    <div class="mt-8 space-y-4">
                      <div class="h-12 bg-white rounded-lg shadow-sm"></div>
                      <div class="h-12 bg-white rounded-lg shadow-sm"></div>
                      <div class="h-12 bg-white rounded-lg shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to grow your audience</h2>
          <p class="mt-4 text-lg text-gray-600">
            Powerful features to help you manage your online presence effectively
          </p>
        </div>
        <div class="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div class="flex flex-col items-start">
            <div class="rounded-lg bg-indigo-50 p-4 sm:p-3">
              <Icon icon="ph:layout-duotone" class="h-12 w-12 sm:h-8 sm:w-8 text-indigo-600" />
            </div>
            <h3 class="mt-6 sm:mt-4 text-xl sm:text-lg font-semibold text-gray-900">Multiple Templates</h3>
            <p class="mt-3 sm:mt-2 text-gray-600">Choose from simple links, store layouts, or blog templates to showcase your content perfectly.</p>
          </div>
          <!-- Feature 2 -->
          <div class="flex flex-col items-start">
            <div class="rounded-lg bg-indigo-50 p-4 sm:p-3">
              <Icon icon="ph:paint-brush-duotone" class="h-12 w-12 sm:h-8 sm:w-8 text-indigo-600" />
            </div>
            <h3 class="mt-6 sm:mt-4 text-xl sm:text-lg font-semibold text-gray-900">Theme Customization</h3>
            <p class="mt-3 sm:mt-2 text-gray-600">Customize colors, fonts, and layouts to match your brand identity perfectly.</p>
          </div>
          <!-- Feature 3 -->
          <div class="flex flex-col items-start">
            <div class="rounded-lg bg-indigo-50 p-4 sm:p-3">
              <Icon icon="ph:chart-line-up-duotone" class="h-12 w-12 sm:h-8 sm:w-8 text-indigo-600" />
            </div>
            <h3 class="mt-6 sm:mt-4 text-xl sm:text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
            <p class="mt-3 sm:mt-2 text-gray-600">Track clicks, visitor locations, and engagement metrics to optimize your content.</p>
          </div>
          <!-- Feature 4 -->
          <div class="flex flex-col items-start">
            <div class="rounded-lg bg-indigo-50 p-4 sm:p-3">
              <Icon icon="ph:shopping-cart-duotone" class="h-12 w-12 sm:h-8 sm:w-8 text-indigo-600" />
            </div>
            <h3 class="mt-6 sm:mt-4 text-xl sm:text-lg font-semibold text-gray-900">E-commerce Ready</h3>
            <p class="mt-3 sm:mt-2 text-gray-600">Showcase and sell products directly through your bio link with our store template.</p>
          </div>
          <!-- Feature 5 -->
          <div class="flex flex-col items-start">
            <div class="rounded-lg bg-indigo-50 p-4 sm:p-3">
              <Icon icon="ph:pencil-duotone" class="h-12 w-12 sm:h-8 sm:w-8 text-indigo-600" />
            </div>
            <h3 class="mt-6 sm:mt-4 text-xl sm:text-lg font-semibold text-gray-900">Blog Platform</h3>
            <p class="mt-3 sm:mt-2 text-gray-600">Share your thoughts and stories with a built-in blog platform that looks great on any device.</p>
          </div>
          <!-- Feature 6 -->
          <div class="flex flex-col items-start">
            <div class="rounded-lg bg-indigo-50 p-4 sm:p-3">
              <Icon icon="ph:devices-duotone" class="h-12 w-12 sm:h-8 sm:w-8 text-indigo-600" />
            </div>
            <h3 class="mt-6 sm:mt-4 text-xl sm:text-lg font-semibold text-gray-900">Mobile Optimized</h3>
            <p class="mt-3 sm:mt-2 text-gray-600">Every template is fully responsive and looks perfect on any device or screen size.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Social Proof Section -->
    <div class="bg-gray-50 py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900">Join thousands of creators</h2>
          <p class="mt-4 text-lg text-gray-600">
            From influencers to small businesses, everyone loves their bio link
          </p>
        </div>
        <div class="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div class="flex flex-col items-center">
            <div class="text-4xl font-bold text-indigo-600">10k+</div>
            <div class="mt-2 text-sm text-gray-600">Active Users</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-4xl font-bold text-indigo-600">50k+</div>
            <div class="mt-2 text-sm text-gray-600">Links Created</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-4xl font-bold text-indigo-600">1M+</div>
            <div class="mt-2 text-sm text-gray-600">Monthly Clicks</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-4xl font-bold text-indigo-600">4.9/5</div>
            <div class="mt-2 text-sm text-gray-600">User Rating</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Section -->
    <div class="py-24 bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple, transparent pricing</h2>
          <p class="mt-4 text-lg text-gray-600">
            Start for free, upgrade when you need more features
          </p>
        </div>
        <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Free Plan -->
          <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900">Free</h3>
            <p class="mt-4 text-sm text-gray-600">Perfect for getting started</p>
            <p class="mt-6">
              <span class="text-4xl font-bold tracking-tight text-gray-900">$0</span>
              <span class="text-sm text-gray-600">/month</span>
            </p>
            <ul class="mt-8 space-y-4">
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">1 bio link</span>
              </li>
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">Basic analytics</span>
              </li>
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">Simple template</span>
              </li>
            </ul>
            <NuxtLink
              to="/register"
              class="mt-8 block w-full rounded-full bg-indigo-50 px-4 py-2 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
            >
              Get started
            </NuxtLink>
          </div>
          <!-- Pro Plan -->
          <div class="rounded-2xl border border-indigo-600 bg-white p-8 shadow-sm ring-1 ring-indigo-600">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Pro</h3>
              <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">Popular</span>
            </div>
            <p class="mt-4 text-sm text-gray-600">Everything you need to grow</p>
            <p class="mt-6">
              <span class="text-4xl font-bold tracking-tight text-gray-900">$9</span>
              <span class="text-sm text-gray-600">/month</span>
            </p>
            <ul class="mt-8 space-y-4">
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">Unlimited bio links</span>
              </li>
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">Advanced analytics</span>
              </li>
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">All templates</span>
              </li>
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">Priority support</span>
              </li>
            </ul>
            <NuxtLink
              to="/register"
              class="mt-8 block w-full rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Get started
            </NuxtLink>
          </div>
          <!-- Business Plan -->
          <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900">Business</h3>
            <p class="mt-4 text-sm text-gray-600">For teams and businesses</p>
            <p class="mt-6">
              <span class="text-4xl font-bold tracking-tight text-gray-900">$29</span>
              <span class="text-sm text-gray-600">/month</span>
            </p>
            <ul class="mt-8 space-y-4">
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">Everything in Pro</span>
              </li>
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">Team collaboration</span>
              </li>
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">Custom Domains</span>
              </li>
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">API access</span>
              </li>
              <li class="flex items-center">
                <Icon icon="ph:check-circle-fill" class="h-5 w-5 text-indigo-600" />
                <span class="ml-3 text-sm text-gray-600">Dedicated support</span>
              </li>
            </ul>
            <NuxtLink
              to="/register"
              class="mt-8 block w-full rounded-full bg-indigo-50 px-4 py-2 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
            >
              Get started
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Expanded Footer -->
    <footer class="bg-gray-900 text-white">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Company Info -->
          <div>
            <h3 class="text-lg font-semibold">biolink</h3>
            <p class="mt-4 text-sm text-gray-400">
              Create beautiful bio links and showcase your content in style.
            </p>
          </div>
          <!-- Product -->
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider">Product</h3>
            <ul class="mt-4 space-y-2">
              <li>
                <NuxtLink to="/features" class="text-sm text-gray-400 hover:text-white">Features</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/pricing" class="text-sm text-gray-400 hover:text-white">Pricing</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/templates" class="text-sm text-gray-400 hover:text-white">Templates</NuxtLink>
              </li>
            </ul>
          </div>
          <!-- Support -->
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider">Support</h3>
            <ul class="mt-4 space-y-2">
              <li>
                <NuxtLink to="/help" class="text-sm text-gray-400 hover:text-white">Help Center</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-sm text-gray-400 hover:text-white">Contact Us</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/status" class="text-sm text-gray-400 hover:text-white">Status</NuxtLink>
              </li>
            </ul>
          </div>
          <!-- Legal -->
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul class="mt-4 space-y-2">
              <li>
                <NuxtLink to="/privacy" class="text-sm text-gray-400 hover:text-white">Privacy Policy</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/terms" class="text-sm text-gray-400 hover:text-white">Terms of Service</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/cookies" class="text-sm text-gray-400 hover:text-white">Cookie Policy</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-12 border-t border-gray-800 pt-8">
          <p class="text-center text-sm text-gray-400">
            © {{ new Date().getFullYear() }} biolink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const user = useSupabaseUser()

// Redirect authenticated users to home page
if (user.value) {
  navigateTo('/home')
}
</script>

<style>
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
