<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl font-bold mb-6">Create Your Ultimate Bio Link</h1>
        <p class="text-xl mb-12">Share all your important links in one beautiful, easy-to-manage page.</p>
        
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <div class="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <icon name="ph:link-bold" class="w-12 h-12 mx-auto mb-4" />
            <h3 class="text-xl font-semibold mb-2">All Your Links</h3>
            <p class="text-white/80">Combine all your social media profiles, websites, and important links in one place.</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <icon name="ph:paint-brush-bold" class="w-12 h-12 mx-auto mb-4" />
            <h3 class="text-xl font-semibold mb-2">Beautiful Design</h3>
            <p class="text-white/80">Customize your profile with a modern, professional look that matches your brand.</p>
          </div>
        </div>

        <NuxtLink 
          to="/editor" 
          class="inline-flex items-center px-6 py-3 text-lg font-medium rounded-full bg-white text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <span>Create Your Bio Link</span>
          <icon name="ph:arrow-right-bold" class="ml-2 w-5 h-5" />
        </NuxtLink>
      </div>

      <div class="mt-24 text-center">
        <h2 class="text-3xl font-bold mb-8">How It Works</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div class="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
            <h3 class="text-xl font-semibold mb-2">Create Profile</h3>
            <p class="text-white/80">Add your photo, description, and customize your profile.</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div class="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
            <h3 class="text-xl font-semibold mb-2">Add Links</h3>
            <p class="text-white/80">Add all your important links and social media profiles.</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div class="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
            <h3 class="text-xl font-semibold mb-2">Share</h3>
            <p class="text-white/80">Get your unique link and share it with your audience.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed for the landing page
</script>
