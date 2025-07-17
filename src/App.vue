<template>
  <div id="app" class="font-arabic">
    <div v-if="authStore.loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">جاري التحميل...</p>
      </div>
    </div>
    <router-view v-else />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { usePlatformStore } from './stores/platform'

const authStore = useAuthStore()
const platformStore = usePlatformStore()

onMounted(async () => {
  await authStore.initAuth()
  if (authStore.isAuthenticated) {
    await platformStore.initializePlatform()
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