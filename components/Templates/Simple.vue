<template>
  <main class="p-4 bg-white h-full w-full space-y-8 pt-12 max-w-lg mx-auto">
    <div class="text-center">
      <div
        v-if="data.i"
        class="h-20 w-20 rounded-full overflow-hidden ring ring-slate-200 mx-auto"
      >
        <img :src="data.i" :alt="data.n" class="h-full w-full object-cover" />
      </div>
      <h1 v-if="data.n" class="text-2xl font-bold mt-4 text-slate-800">
        {{ data.n }}
      </h1>
      <p v-if="data.d" class="text-sm mt-2 text-slate-600">
        {{ data.d }}
      </p>
    </div>
    <div
      v-if="!allSocialLinksAreEmpty"
      class="flex items-center justify-center flex-wrap"
    >
      <span v-if="data.f" class="p-1">
        <a :href="data.f" target="_blank" rel="noopener noreferrer" @click="handleClick(data.f)">
          <Icon icon="ph:facebook-logo-duotone" class="h-6 w-6" />
        </a>
      </span>
      <span v-if="data.t" class="p-1">
        <a :href="data.t" target="_blank" rel="noopener noreferrer" @click="handleClick(data.t)">
          <Icon icon="ph:twitter-logo-duotone" class="h-6 w-6" />
        </a>
      </span>
      <span v-if="data.ig" class="p-1">
        <a :href="data.ig" target="_blank" rel="noopener noreferrer" @click="handleClick(data.ig)">
          <Icon icon="ph:instagram-logo-duotone" class="h-6 w-6" />
        </a>
      </span>
      <span v-if="data.gh" class="p-1">
        <a :href="data.gh" target="_blank" rel="noopener noreferrer" @click="handleClick(data.gh)">
          <Icon icon="ph:github-logo-duotone" class="h-6 w-6" />
        </a>
      </span>
      <span v-if="data.tg" class="p-1">
        <a :href="data.tg" target="_blank" rel="noopener noreferrer" @click="handleClick(data.tg)">
          <Icon icon="ph:telegram-logo-duotone" class="h-6 w-6" />
        </a>
      </span>
      <span v-if="data.w" class="p-1">
        <a :href="data.w" target="_blank" rel="noopener noreferrer" @click="handleClick(data.w)">
          <Icon icon="ph:whatsapp-logo-duotone" class="h-6 w-6" />
        </a>
      </span>
      <span v-if="data.y" class="p-1">
        <a :href="data.y" target="_blank" rel="noopener noreferrer" @click="handleClick(data.y)">
          <Icon icon="ph:youtube-logo-duotone" class="h-6 w-6" />
        </a>
      </span>
      <span v-if="data.e" class="p-1">
        <a :href="`mailto:${data.e}`" target="_blank" rel="noopener noreferrer" @click="handleClick(data.e)">
          <Icon icon="ph:envelope-duotone" class="h-6 w-6" />
        </a>
      </span>
      <span v-if="data.l" class="p-1">
        <a :href="data.l" target="_blank" rel="noopener noreferrer" @click="handleClick(data.l)">
          <Icon icon="ph:linkedin-logo-duotone" class="h-6 w-6" />
        </a>
      </span>
    </div>
    <div class="space-y-3">
      <a
        v-for="link in data.ls"
        :key="link.u"
        :href="link.u"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleClick(link.u)"
        class="block w-full px-6 py-3 text-left bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
      >
        <div class="flex items-center space-x-3">
          <Icon v-if="link.i" :icon="link.i" class="h-5 w-5" />
          <span>{{ link.l }}</span>
        </div>
      </a>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAnalyticsStore } from '~/stores/analytics'

interface Link {
  l: string
  u: string
  i?: string
}

interface Data {
  n: string
  d: string
  i: string
  f?: string
  t?: string
  ig?: string
  gh?: string
  tg?: string
  w?: string
  y?: string
  e?: string
  l?: string
  ls: Link[]
}

const props = defineProps<{
  data: Data
}>()

const analytics = useAnalyticsStore()

const allSocialLinksAreEmpty = computed(() => {
  return ![props.data.f, props.data.t, props.data.ig, props.data.gh, props.data.tg, props.data.w, props.data.y, props.data.e, props.data.l].some(Boolean)
})

const handleClick = async (url: string) => {
  await analytics.trackLinkClick(url)
}
</script>

<style scoped></style>
