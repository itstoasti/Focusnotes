<template>
  <base-form-section title="Links" description="Add some links here">
    <template #helpertext>
      <p class="mt-1 text-xs text-gray-600">
        Icon keys can be found in
        <a class="underline" href="https://icones.js.org/"
          >https://icones.js.org/</a
        >.
      </p>
    </template>
    <draggable
      :list="modelValue"
      item-key="link"
      class="list-group"
      ghost-class="ghost"
    >
      <template #item="{ element: link }">
        <div class="relative mb-6 group">
          <button class="absolute top-2 -left-8">
            <icon
              name="radix-icons:drag-handle-dots-2"
              class="h-6 w-6 text-slate-500 drag-handle"
            />
          </button>
          <button
            @click="removeLink(link)"
            class="hidden group-hover:flex items-center justify-center h-6 w-6 rounded-full bg-slate-300 text-slate-600 absolute -right-3 -top-3"
          >
            <icon name="fluent:dismiss-24-regular" class="h-4 w-4" />
          </button>
          <div class="shadow sm:overflow-hidden sm:rounded-md">
            <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                    >Icon Key (optional)</label
                  >
                  <input
                    type="text"
                    name="iconKey"
                    id="iconKey"
                    v-model="link.i"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    for="label"
                    class="block text-sm font-medium text-gray-700"
                    >{{ isStoreTemplate ? 'Product Name' : isBlogTemplate ? 'Post Title' : 'Label' }}</label
                  >
                  <input
                    type="text"
                    name="label"
                    id="label"
                    v-model="link.l"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div class="col-span-2">
                  <label
                    for="url"
                    class="block text-sm font-medium text-gray-700"
                    >URL</label
                  >
                  <input
                    type="url"
                    name="url"
                    id="url"
                    v-model="link.u"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <!-- Store Template Fields -->
                <template v-if="isStoreTemplate">
                  <div class="col-span-2">
                    <label
                      for="price"
                      class="block text-sm font-medium text-gray-700"
                      >Price</label
                    >
                    <input
                      type="text"
                      name="price"
                      id="price"
                      v-model="link.price"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </template>

                <!-- Blog Template Fields -->
                <template v-if="isBlogTemplate">
                  <div class="col-span-2">
                    <label
                      for="image"
                      class="block text-sm font-medium text-gray-700"
                      >Post Image URL</label
                    >
                    <input
                      type="url"
                      name="image"
                      id="image"
                      v-model="link.img"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div class="col-span-2">
                    <label
                      for="description"
                      class="block text-sm font-medium text-gray-700"
                      >Post Description</label
                    >
                    <textarea
                      name="description"
                      id="description"
                      v-model="link.description"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Write a brief description of your blog post..."
                    ></textarea>
                  </div>
                </template>
              </div>
              <p
                class="mt-2 text-xs text-center text-slate-400"
                v-if="!link.l || !link.u"
              >
                Link shown in preview once label and url are added
              </p>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <button
      @click="appendLink"
      class="mt-8 border-2 text-slate-500 border-slate-300 rounded-lg block w-full py-2"
    >
      <icon name="fluent:add-circle-24-regular" class="h-6 w-6" />
    </button>
  </base-form-section>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

interface Props {
  modelValue: {
    l: string
    u: string
    i?: string
    img?: string
    price?: string
    description?: string
  }[]
  template?: 'simple' | 'store' | 'blog'
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const isStoreTemplate = computed(() => props.template === 'store')
const isBlogTemplate = computed(() => props.template === 'blog')

const appendLink = () => {
  props.modelValue.push({
    i: "",
    l: "",
    u: "",
  });
  emit("update:modelValue", props.modelValue);
};

const removeLink = (link: any) => {
  const index = props.modelValue.indexOf(link)
  if (index > -1) {
    const newLinks = [...props.modelValue]
    newLinks.splice(index, 1)
    emit('update:modelValue', newLinks)
  }
};
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
