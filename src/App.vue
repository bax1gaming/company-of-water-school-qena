<template>
  <div id="app" class="font-arabic">
    <!-- Loading Screen -->
    <div v-if="authStore.loading" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Droplets class="w-10 h-10 text-white" />
        </div>
        <p class="text-gray-600">جاري التحميل...</p>
      </div>
    </div>

    <!-- Main App -->
    <div v-else>
      <!-- Show Login if not authenticated -->
      <Login v-if="!authStore.isAuthenticated" />
      
      <!-- Show Main App if authenticated -->
      <router-view v-else />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { usePlatformStore } from './stores/platform'
import Login from './views/Login.vue'
import { Droplets } from 'lucide-vue-next'

const authStore = useAuthStore()
const platformStore = usePlatformStore()

onMounted(async () => {
  await authStore.initAuth()
  
  // Initialize platform data if user is authenticated
  if (authStore.isAuthenticated) {
    await platformStore.initializeData()
  }
})
</script>

<style>
.font-arabic {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
  text-align: right;
}

* {
  box-sizing: border-box;
}
</style>