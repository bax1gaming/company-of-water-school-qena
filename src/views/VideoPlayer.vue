<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <button @click="goBack" class="text-gray-600 hover:text-gray-900">
              <ArrowRight class="w-6 h-6" />
            </button>
            <Droplets class="w-8 h-8 text-blue-600" />
            <div>
              <h1 class="text-xl font-semibold text-gray-900">{{ videoData?.title }}</h1>
              <p class="text-sm text-gray-600">{{ videoData?.trainer }}</p>
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

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="videoData">
      <div v-if="videoInfo">
        <!-- Video Player -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div class="aspect-video bg-gray-900 flex items-center justify-center">
            <!-- YouTube/Vimeo Embed -->
            <div v-if="videoInfo?.video_url && isValidVideoUrl(videoInfo.video_url)" class="w-full h-full">
              <iframe
                :src="getEmbedUrl(videoInfo.video_url)"
                class="w-full h-full"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
            
            <!-- Placeholder for file uploads or invalid URLs -->
            <div v-else class="text-center text-white">
              <Play class="w-16 h-16 mx-auto mb-4" />
              <h3 class="text-xl font-semibold mb-2">{{ videoInfo?.title }}</h3>
              <p class="text-gray-300">
                {{ videoInfo?.file_name ? 'ملف فيديو محلي' : 'مشغل الفيديو (تجريبي)' }}
              </p>
              <p class="text-sm text-gray-400 mt-2">المدة: {{ videoInfo?.duration }}</p>
              <p v-if="videoInfo?.file_name" class="text-sm text-gray-400">
                الملف: {{ videoInfo.file_name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Video Info -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ videoInfo?.title }}</h2>
              <div class="flex items-center space-x-4 rtl:space-x-reverse text-gray-600">
                <span class="flex items-center space-x-2 rtl:space-x-reverse">
                  <UserCheck class="w-5 h-5" />
                  <span>{{ videoInfo?.trainer_name }}</span>
                </span>
                <span class="flex items-center space-x-2 rtl:space-x-reverse">
                  <Clock class="w-5 h-5" />
                  <span>{{ videoInfo?.duration }}</span>
                </span>
                <span class="flex items-center space-x-2 rtl:space-x-reverse">
                  <Calendar class="w-5 h-5" />
                  <span>{{ videoInfo?.upload_date }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Video Controls -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">أدوات التحكم</h3>
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse">
              <Play class="w-5 h-5" />
              <span>تشغيل</span>
            </button>
            <button class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
              <Pause class="w-5 h-5" />
              <span>إيقاف مؤقت</span>
            </button>
            <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 rtl:space-x-reverse">
              <Download class="w-5 h-5" />
              <span>تحميل</span>
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <div class="animate-pulse" v-if="!videoInfo">
          <div class="w-16 h-16 bg-gray-200 rounded mx-auto mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
        <div v-else class="text-center py-12">
        <Video class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">الفيديو غير موجود</h3>
        <p class="text-gray-600">لم يتم العثور على الفيديو المطلوب</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { 
  Droplets, 
  LogOut, 
  ArrowRight, 
  Play, 
  Pause, 
  Download, 
  UserCheck, 
  Clock, 
  Calendar,
  Video
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()

const videoData = computed(() => {
  return null // Will be loaded asynchronously
})

const videoInfo = ref(null)

onMounted(async () => {
  try {
    videoInfo.value = await platformStore.getVideoById(route.params.videoId)
  } catch (error) {
    console.error('Error loading video:', error)
  }
})

const isValidVideoUrl = (url) => {
  if (!url) return false
  return url.includes('youtube.com') || 
         url.includes('youtu.be') || 
         url.includes('vimeo.com') ||
         url.includes('dailymotion.com')
}

const getEmbedUrl = (url) => {
  if (!url) return ''
  
  // YouTube
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1].split('?')[0]
    return `https://player.vimeo.com/video/${videoId}`
  }
  
  // Dailymotion
  if (url.includes('dailymotion.com/video/')) {
    const videoId = url.split('video/')[1].split('?')[0]
    return `https://www.dailymotion.com/embed/video/${videoId}`
  }
  
  return url
}
const goBack = () => {
  router.go(-1)
}

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>