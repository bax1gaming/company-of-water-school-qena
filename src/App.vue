<template>
  <div id="app" class="font-arabic">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
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