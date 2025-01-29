<template>
  <li>
    <a :href="url" target="_blank" rel="noopener noreferrer" v-if="label && url" @click="handleClick">
      <dt
        class="flex items-center space-x-2 p-1 -m-1 rounded-xl hover:bg-slate-100 bg-slate-50"
      >
        <div
          class="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg text-slate-500"
        >
          <Icon v-if="icon" :icon="icon" class="h-5 w-5" />
          <Icon v-else icon="ph:link-simple" class="h-5 w-5" />
        </div>
        <div class="w-full flex-grow min-w-0">
          <p class="font-medium text-sm leading-6 text-gray-900">
            {{ label }}
          </p>
        </div>
      </dt>
    </a>
  </li>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useAnalyticsStore } from '~/stores/analytics'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "ph:link-simple",
  },
});

const analytics = useAnalyticsStore()

const handleClick = async () => {
  // Track the click using the URL as the linkId
  await analytics.trackLinkClick(props.url)
}
</script>
