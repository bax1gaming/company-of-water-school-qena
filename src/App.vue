<template>
  <div id="app">
    <div v-if="loading" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري التحميل...</p>
      </div>
    </div>
    
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { usePlatformStore } from './stores/platform'

const loading = ref(true)
const authStore = useAuthStore()
const platformStore = usePlatformStore()

onMounted(async () => {
  try {
    // Initialize auth first
    await authStore.initAuth()
    
    // Initialize platform data regardless of auth status for demo
    await platformStore.initializeData()
  } catch (error) {
    console.warn('Error initializing app:', error)
    // Don't block the app from loading
  } finally {
    loading.value = false
  }
})
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  direction: rtl;
  text-align: right;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
}
</style>