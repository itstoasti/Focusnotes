<template>
  <div class="h-screen w-full grid grid-cols-3 divide-x bg-slate-100">
    <!-- Left section (editor) -->
    <div class="col-span-2 flex flex-col h-full bg-white">
      <!-- Add sidebar -->
      <AppSidebar />

      <!-- Buttons -->
      <div class="flex items-center justify-end p-4 space-x-2">
        <button
          @click="prefillDemoData"
          class="px-4 py-2 rounded-lg bg-gray-600 text-white shadow-lg hover:bg-gray-700 flex items-center space-x-2"
        >
          <Icon icon="ph:plus-circle-bold" class="h-5 w-5" />
          <span>Add demo data</span>
        </button>
        
        <button
          @click="publish"
          class="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Icon icon="ph:paper-plane-tilt-bold" class="h-5 w-5" />
          <span>Publish</span>
        </button>
      </div>

      <!-- Form content -->
      <div class="flex-grow overflow-y-auto">
        <div class="max-w-4xl mx-auto p-8 space-y-8">
          <!-- Template selector moved to top -->
          <AppTemplateSelector v-model="data.template" />
          <app-form-hr />
          
          <app-form-profile
            v-model:name="data.n"
            v-model:description="data.d"
            v-model:image="data.i"
          />
          <app-form-hr />
          <app-form-social-links
            v-model:facebook="data.f"
            v-model:twitter="data.t"
            v-model:instagram="data.ig"
            v-model:github="data.gh"
            v-model:telegram="data.tg"
            v-model:whatsapp="data.w"
            v-model:youtube="data.y"
            v-model:email="data.e"
            v-model:linkedin="data.l"
          />
          <app-form-hr />
          <component
            :is="data.template === 'store' ? AppFormStoreProducts : data.template === 'blog' ? AppFormBlog : AppFormLinks"
            v-model="data.ls"
            :template="data.template"
          />
          <app-form-hr />
          <ThemeCustomizer :template="data.template" />
        </div>
      </div>
    </div>

    <!-- Right section (preview) -->
    <div class="bg-slate-100 relative">
      <div class="sticky top-0 h-screen overflow-hidden">
        <div 
          class="h-screen grid place-items-center"
          :style="{ backgroundColor: theme.current.colors.background }"
        >
          <div
            class="h-[729px] w-[340px] rounded-[3rem] overflow-hidden"
            :class="[
              theme.current.colors.background === '#1F2937' ? 'ring-8 ring-white/20' : 'ring-8 ring-slate-800'
            ]"
          >
            <div 
              class="h-full scrollbar-hide"
              :class="{ 
                'overflow-y-auto': data.template === 'simple',
                'overflow-y-scroll': data.template === 'store' || data.template === 'blog'
              }"
            >
              <ThemeProvider 
                class="h-full"
                :style="{
                  '--color-primary': theme.current.colors.primary,
                  '--color-background': theme.current.colors.background,
                  '--color-text': theme.current.colors.text,
                  '--color-accent': theme.current.colors.accent,
                  '--font-heading': theme.current.font.heading,
                  '--font-body': theme.current.font.body,
                  backgroundColor: theme.current.colors.background
                }"
              >
                <component 
                  :is="data.template === 'store' ? TemplateStore : data.template === 'blog' ? TemplateBlog : TemplateSimple" 
                  :data="data" 
                />
              </ThemeProvider>
            </div>
          </div>
        </div>
        <!-- Branding -->
        <a
          href="https://twitter.com/biolink-toast"
          target="_blank"
          class="fixed bottom-0 right-0 bg-white rounded-tl-lg shadow px-4 py-1 font-medium text-sm text-gray-500 hover:bg-slate-50 z-50"
        >
          BIOLINK
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { encodeData } from "../utils/transformer";
import AppFormStoreProducts from '~/components/AppFormStoreProducts.vue'
import AppFormLinks from '~/components/AppFormLinks.vue'
import AppFormBlog from '~/components/AppForm/Blog.vue'
import TemplateSimple from '~/components/Templates/Simple.vue'
import TemplateStore from '~/components/Templates/Store.vue'
import TemplateBlog from '~/components/Templates/Blog.vue'

// Auth
const client = useSupabaseClient()
const user = useSupabaseUser()

// Define middleware
definePageMeta({
  middleware: ['auth']
})

const handleLogout = async () => {
  const { error } = await client.auth.signOut()
  if (error) {
    alert(error.message)
  } else {
    navigateTo('/login')
  }
}

interface Link {
  l: string
  u: string
  i?: string
  img?: string
  price?: string
  description?: string
}

interface FormData {
  n: string
  d: string
  i: string
  f: string
  t: string
  ig: string
  gh: string
  tg: string
  l: string
  e: string
  w: string
  y: string
  ls: Link[]
  template: 'simple' | 'store' | 'blog'
}

const data = ref<FormData>({
  n: "",
  d: "",
  i: "",
  f: "",
  t: "",
  ig: "",
  gh: "",
  tg: "",
  l: "",
  e: "",
  w: "",
  y: "",
  ls: [],
  template: "simple",
});

// Add after the data ref declaration
const route = useRoute()

// Load existing link data if editing
onMounted(async () => {
  const editId = route.query.edit
  if (editId) {
    const { data: linkData, error } = await client
      .from('links')
      .select('*')
      .eq('id', editId)
      .single()
    
    if (error) {
      console.error('Error loading link:', error)
      alert('Error loading link')
      return
    }
    
    if (linkData) {
      // Populate form with existing data
      data.value = {
        ...linkData.data,
        template: linkData.data.template
      }
      
      // Set theme
      if (linkData.data.theme) {
        theme.current = linkData.data.theme
      }
    }
  }
})

// Watch for template changes and update demo data if it's being used
watch(() => data.value.template, async (newTemplate, oldTemplate) => {
  console.log('[Editor] Template changed from', oldTemplate, 'to:', newTemplate)
  console.log('[Editor] Template type:', typeof newTemplate)
  console.log('[Editor] Raw template value:', JSON.stringify(newTemplate))
  
  // Only update if using demo data (check if name matches demo data)
  if (data.value.n === "John Snow") {
    await nextTick()
    prefillDemoData();
  } else {
    // Clear links when switching templates (unless using demo data)
    await nextTick()
    data.value.ls = [];
  }
}, { immediate: true });

const prefillDemoData = () => {
  if (data.value.template === "store") {
    data.value = {
      n: "John's Store",
      d: "Welcome to my store! Check out my latest products.",
      i: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      f: "https://www.facebook.com/john_store",
      t: "https://twitter.com/john_store",
      ig: "https://www.instagram.com/john_store",
      e: "store@john.cc",
      gh: "",
      tg: "",
      w: "",
      y: "",
      l: "",
      template: "store",
      ls: [
        {
          l: "Leather Gloves",
          u: "https://example.com/gloves",
          img: "https://images.unsplash.com/photo-1490118121063-d12f8c4464ce",
          price: "49.99",
          description: "Premium leather gloves handcrafted from the finest Italian leather. Perfect for both style and warmth."
        },
        {
          l: "Vintage Watch",
          u: "https://example.com/watch",
          img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
          price: "199.99",
          description: "Classic automatic timepiece with genuine leather strap. Features a sophisticated design that never goes out of style."
        },
        {
          l: "Wool Scarf",
          u: "https://example.com/scarf",
          img: "https://images.unsplash.com/photo-1584613862210-a67f5b52e4d6",
          price: "29.99",
          description: "Soft, warm wool scarf made from 100% merino wool. Perfect for cold winter days."
        },
        {
          l: "Leather Wallet",
          u: "https://example.com/wallet",
          img: "https://images.unsplash.com/photo-1627123424574-724758594e93",
          price: "79.99",
          description: "Handcrafted leather wallet with multiple card slots and RFID protection. Made from genuine full-grain leather."
        }
      ]
    }
  } else if (data.value.template === "blog") {
    data.value = {
      n: "John's Blog",
      d: "Thoughts, stories and ideas.",
      i: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      f: "https://www.facebook.com/john_blog",
      t: "https://twitter.com/john_blog",
      ig: "https://www.instagram.com/john_blog",
      e: "blog@john.cc",
      gh: "https://github.com/john",
      tg: "",
      w: "",
      y: "",
      l: "",
      template: "blog",
      ls: [
        {
          l: "Getting Started with Web Development",
          img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
          content: "Web development can seem daunting at first, but with the right approach, anyone can learn it. In this post, I'll share my journey and some tips for beginners.\n\nFirst, start with the basics: HTML, CSS, and JavaScript. These three technologies form the foundation of web development. HTML structures your content, CSS styles it, and JavaScript adds interactivity.\n\nHere's a simple roadmap to follow:\n1. Learn HTML basics\n2. Style with CSS\n3. Add interactivity with JavaScript\n4. Choose a framework\n5. Practice, practice, practice!",
          description: "A beginner's guide to starting your web development journey",
          published: true,
          updatedAt: new Date()
        },
        {
          l: "The Future of AI in Technology",
          img: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
          content: "Artificial Intelligence is rapidly changing the technology landscape. From chatbots to autonomous vehicles, AI is becoming increasingly integrated into our daily lives.\n\nIn this post, we'll explore:\n- Current AI trends\n- Future predictions\n- Impact on jobs\n- Ethical considerations\n\nAs we move forward, it's crucial to understand both the potential and limitations of AI technology.",
          description: "Exploring the impact of AI on the future of technology",
          published: true,
          updatedAt: new Date()
        },
        {
          l: "Building Sustainable Software",
          img: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a",
          content: "Sustainable software development is about creating applications that are maintainable, scalable, and environmentally conscious.\n\nKey principles include:\n- Writing clean, maintainable code\n- Optimizing for performance\n- Reducing energy consumption\n- Using efficient algorithms\n\nBy following these principles, we can build better software that lasts longer and has a smaller environmental impact.",
          description: "Best practices for creating sustainable and maintainable software",
          published: true,
          updatedAt: new Date()
        },
        {
          l: "Modern UI Design Trends",
          img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
          content: "The world of UI design is constantly evolving, with new trends emerging every year. In this post, we'll explore the latest design patterns and techniques that are shaping modern web interfaces.\n\nKey trends include:\n- Minimalist interfaces\n- Dark mode design\n- Micro-interactions\n- Glassmorphism\n- Responsive animations\n\nUnderstanding these trends helps create more engaging and user-friendly applications that meet modern design standards.",
          description: "Exploring current trends in user interface design and modern web aesthetics",
          published: true,
          updatedAt: new Date()
        }
      ]
    }
  } else {
    data.value = {
      n: "John Snow",
      d: "Developer, designer & content creator",
      i: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      f: "https://www.facebook.com/john",
      t: "https://twitter.com/john",
      ig: "https://www.instagram.com/john",
      e: "hello@john.cc",
      gh: "https://github.com/john",
      tg: "",
      w: "",
      y: "",
      l: "",
      template: "simple",
      ls: [
        {
          l: "Personal Website",
          u: "https://john.cc"
        },
        {
          l: "Latest Project",
          u: "https://github.com/john/project"
        },
        {
          l: "Get in touch",
          u: "mailto:hello@john.cc"
        }
      ]
    }
  }
};

const theme = useThemeStore()
const shortLinks = useShortLinkStore()

// Update publish function to handle updates
const publish = async () => {
  const editId = route.query.edit
  
  // Make sure we include the complete theme data
  const publishData = {
    ...data.value,
    theme: {
      ...theme.current,
      colors: { ...theme.current.colors },
      font: { ...theme.current.font }
    }
  };
  
  if (editId) {
    // Update existing link
    const { error: updateError } = await client
      .from('links')
      .update({ data: publishData })
      .match({ id: editId })
    
    if (updateError) {
      console.error('Error updating link:', updateError)
      alert('Error updating link')
      return
    }
    
    alert('Link updated successfully!')
    navigateTo('/links')
    return
  }
  
  // Create new link
  const longUrl = `${window.location.origin}/1?data=${encodeData(publishData)}`;
  console.log('Creating short link for URL:', longUrl);
  const shortId = await shortLinks.createShortLink(longUrl);

  if (!shortId) {
    console.error('Failed to create short link')
    alert('Error creating link')
    return
  }

  console.log('Created short link with ID:', shortId);

  // Store the link data in the links table
  const { data: insertData, error: insertError } = await client
    .from('links')
    .insert({
      short_id: shortId,
      data: publishData,
      clicks: 0,
      user_id: user.value?.id
    })
    .select()

  if (insertError) {
    console.error('Error storing link:', insertError.message)
    alert('Error storing link: ' + insertError.message)
    return
  }

  console.log('Successfully stored link:', insertData)

  const shortUrl = `${window.location.origin}/s/${shortId}`;
  navigator.clipboard.writeText(shortUrl).then(() => {
    alert("Link copied to clipboard");
  });
  
  // Navigate to the links page
  navigateTo('/links')
};
</script>

<style>
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style> 