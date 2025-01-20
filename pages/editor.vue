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
            :is="data.template === 'store' ? AppFormStoreProducts : AppFormLinks"
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
        <div class="preview-container h-full">
          <ThemeProvider>
            <app-form-preview :data="data" />
          </ThemeProvider>
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
  template: 'simple' | 'store'
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
  const template = data.value.template;
  
  if (template === 'store') {
    data.value = {
      n: "John Snow",
      d: "Welcome to my store! Check out my latest products.",
      i: "https://i.insider.com/56743fad72f2c12a008b6cc0",
      f: "https://www.facebook.com/john_snow",
      t: "https://twitter.com/john_snow",
      ig: "https://www.instagram.com/john_snow",
      e: "mail@john_snow.cc",
      gh: "https://github.com/john_snow",
      tg: "https://t.me/john_snow",
      w: "+918888888888",
      y: "https://youtube.com/@john_snow",
      l: "https://linkedin.com/john_snow",
      template: "store",
      ls: [
        {
          l: "Winter Coat",
          u: "https://example.com/winter-coat",
          img: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          price: "99.99",
          description: "Stay warm with our premium winter coat."
        },
        {
          l: "Snow Boots",
          u: "https://example.com/snow-boots",
          img: "https://images.unsplash.com/photo-1542280756-74b2f55e73ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          price: "79.99",
          description: "Perfect for walking in the snow."
        },
        {
          l: "Leather Gloves",
          u: "https://example.com/leather-gloves",
          img: "https://images.unsplash.com/photo-1642952180306-588f9eddce8e?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          price: "49.99",
          description: "Premium leather gloves for cold weather."
        },
        {
          l: "Wool Scarf",
          u: "https://example.com/wool-scarf",
          img: "https://images.unsplash.com/photo-1607242792481-37f27e1d74e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          price: "29.99",
          description: "Soft and warm wool scarf."
        }
      ],
    };
  } else {
    data.value = {
      n: "John Snow",
      d: "I'm John Snow, the king in the north. I know Nothing.",
      i: "https://i.insider.com/56743fad72f2c12a008b6cc0",
      f: "https://www.facebook.com/john_snow",
      t: "https://twitter.com/john_snow",
      ig: "https://www.instagram.com/john_snow",
      e: "mail@john_snow.cc",
      gh: "https://github.com/john_snow",
      tg: "https://t.me/john_snow",
      w: "+918888888888",
      y: "https://youtube.com/@john_snow",
      l: "https://linkedin.com/john_snow",
      template: "simple",
      ls: [
        {
          l: "My Website",
          i: "ph:globe-duotone",
          u: "https://example.com",
        },
        {
          l: "Amazon wishlist",
          i: "ant-design:amazon-outlined",
          u: "https://amazon.in",
        },
        {
          l: "React JS course",
          i: "grommet-icons:reactjs",
          u: "https://reactjs.org/",
        },
        {
          l: "Donate for our cause",
          i: "iconoir:donate",
          u: "https://who.int",
        },
        {
          l: "Download my resume",
          i: "ph:file-pdf",
          u: "https://google.com",
        },
      ],
    };
  }
};

const theme = useThemeStore()
const shortLinks = useShortLinkStore()

const publish = async () => {
  const publishData = {
    ...data.value,
    theme: theme.current
  };
  const longUrl = `${window.location.origin}/1?data=${encodeData(publishData)}`;
  
  // Create short link
  const shortId = await shortLinks.createShortLink(longUrl);
  const shortUrl = shortId ? `${window.location.origin}/s/${shortId}` : longUrl;
  
  navigator.clipboard.writeText(shortUrl).then(() => {
    alert("Link copied to clipboard");
  });
};
</script> 