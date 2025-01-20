<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-medium text-gray-900">Products</h2>
      <button
        type="button"
        @click="addProduct"
        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
      >
        Add Product
      </button>
    </div>

    <div v-if="modelValue.length === 0" class="text-center py-4 text-gray-500">
      No products added yet
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(product, index) in modelValue"
        :key="index"
        class="bg-gray-50 rounded-lg p-4 space-y-4"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            v-model="product.l"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Product URL</label>
          <input
            type="text"
            v-model="product.u"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter product URL"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Product Image URL</label>
          <input
            type="text"
            v-model="product.img"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter product image URL"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="text"
            v-model="product.price"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter product price"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="product.description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter product description"
          ></textarea>
        </div>

        <button
          type="button"
          @click="removeProduct(index)"
          class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Remove Product
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  l: string
  u: string
  img?: string
  price?: string
  description?: string
}

const props = defineProps<{
  modelValue: Product[]
}>()

const emit = defineEmits(['update:modelValue'])

const addProduct = () => {
  const newProduct: Product = {
    l: '',
    u: '',
    img: '',
    price: '',
    description: ''
  }
  emit('update:modelValue', [...props.modelValue, newProduct])
}

const removeProduct = (index: number) => {
  const newProducts = [...props.modelValue]
  newProducts.splice(index, 1)
  emit('update:modelValue', newProducts)
}
</script> 