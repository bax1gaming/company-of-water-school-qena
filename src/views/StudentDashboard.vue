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
              <p class="text-sm text-gray-600">مرحباً {{ authStore.user?.name }}</p>
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
      <!-- Student Info -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User class="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ authStore.user?.name }}</h2>
            <p class="text-gray-600">{{ authStore.user?.className }}</p>
          </div>
        </div>
      </div>

      <!-- Announcements -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Bell class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">الإعلانات</h3>
        </div>
        <div class="space-y-4">
          <div
            v-for="announcement in platformStore.announcements"
            :key="announcement.id"
            class="border-r-4 border-blue-500 bg-blue-50 p-4 rounded-lg"
          >
            <h4 class="font-semibold text-gray-900 mb-2">{{ announcement.title }}</h4>
            <p class="text-gray-700 mb-2">{{ announcement.content }}</p>
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ announcement.author }}</span>
              <span>{{ announcement.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- My Class -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <BookOpen class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">الصفوف الدراسية</h3>
        </div>
        
        <!-- All Classes Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="cls in platformStore.classes"
            :key="cls.id"
            class="border-2 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
            :class="[
              authStore.user?.class === cls.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            ]"
            @click="viewClass(cls.id)"
          >
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                   :class="[
                     authStore.user?.class === cls.id 
                       ? 'bg-blue-100' 
                       : 'bg-gray-100'
                   ]">
                <BookOpen class="w-8 h-8" 
                         :class="[
                           authStore.user?.class === cls.id 
                             ? 'text-blue-600' 
                             : 'text-gray-600'
                         ]" />
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ cls.name }}</h4>
              <p class="text-sm text-gray-600 mb-4">{{ cls.description }}</p>
              <div class="flex items-center justify-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                <span class="flex items-center space-x-1 rtl:space-x-reverse">
                  <Users class="w-4 h-4" />
                  <span>{{ cls.students }}</span>
                </span>
                <span class="flex items-center space-x-1 rtl:space-x-reverse">
                  <Video class="w-4 h-4" />
                  <span>{{ cls.videos.length }}</span>
                </span>
              </div>
              <div v-if="authStore.user?.class === cls.id" class="mt-3">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  صفي الدراسي
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { 
  Droplets, 
  LogOut, 
  User, 
  Bell, 
  BookOpen, 
  Users, 
  Video, 
  Play 
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()

const studentClass = computed(() => {
  if (authStore.user?.class) {
    return platformStore.getClassById(authStore.user.class)
  }
  return null
})

const logout = () => {
  authStore.logout()
  router.push('/')
}

const viewClass = (classId) => {
  router.push(`/class/${classId}`)
}
</script>