<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <Droplets class="w-8 h-8 text-blue-600" />
            <div>
              <h1 class="text-xl font-semibold text-gray-900">لوحة الطالب</h1>
              <p class="text-sm text-gray-600">مرحباً بك في منصة التدريب</p>
            </div>
          </div>
          <button
            @click="logout"
            class="text-gray-600 hover:text-gray-900 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <LogOut class="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">مرحباً {{ authStore.user?.email }}</h2>
        <p class="text-gray-600">يمكنك الوصول إلى جميع الدورات والفيديوهات التدريبية من هنا</p>
      </div>

      <!-- Videos Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="video in videos"
          :key="video.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          @click="watchVideo(video.id)"
        >
          <div class="aspect-video bg-gray-900 flex items-center justify-center">
            <Play class="w-12 h-12 text-white" />
          </div>
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ video.title }}</h3>
            <div class="flex items-center space-x-4 rtl:space-x-reverse text-gray-600 text-sm">
              <span class="flex items-center space-x-1 rtl:space-x-reverse">
                <UserCheck class="w-4 h-4" />
                <span>{{ video.trainer_name }}</span>
              </span>
              <span class="flex items-center space-x-1 rtl:space-x-reverse">
                <Clock class="w-4 h-4" />
                <span>{{ video.duration }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="platformStore.loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">جاري تحميل الفيديوهات...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="videos.length === 0" class="text-center py-12">
        <Video class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">لا توجد فيديوهات متاحة</h3>
        <p class="text-gray-600">لم يتم رفع أي فيديوهات تدريبية بعد</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { 
  Droplets, 
  LogOut, 
  Play, 
  UserCheck, 
  Clock, 
  Video
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()

const videos = computed(() => platformStore.videos || [])

onMounted(async () => {
  try {
    await platformStore.loadVideos()
  } catch (error) {
    console.error('Error loading videos:', error)
  }
})

const watchVideo = (videoId) => {
  router.push(`/video/${videoId}`)
}

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>