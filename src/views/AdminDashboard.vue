<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <Droplets class="w-8 h-8 text-blue-600" />
            <div>
              <h1 class="text-xl font-semibold text-gray-900">لوحة الإدارة</h1>
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
      <!-- Statistics -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">إجمالي الطلاب</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalStudents }}</p>
            </div>
            <Users class="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">الصفوف الدراسية</p>
              <p class="text-2xl font-bold text-gray-900">{{ platformStore.classes.length }}</p>
            </div>
            <BookOpen class="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">إجمالي الفيديوهات</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalVideos }}</p>
            </div>
            <Video class="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">الإعلانات</p>
              <p class="text-2xl font-bold text-gray-900">{{ platformStore.announcements.length }}</p>
            </div>
            <Bell class="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <!-- Add Announcement -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Megaphone class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">إضافة إعلان جديد</h3>
        </div>
        
        <form @submit.prevent="addAnnouncement" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الإعلان</label>
            <input
              v-model="newAnnouncement.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل عنوان الإعلان"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">محتوى الإعلان</label>
            <textarea
              v-model="newAnnouncement.content"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل محتوى الإعلان"
            ></textarea>
          </div>

          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            نشر الإعلان
          </button>
        </form>
      </div>

      <!-- Classes Management -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <BookOpen class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">إدارة الصفوف الدراسية</h3>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="cls in platformStore.classes"
            :key="cls.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="viewClass(cls.id)"
          >
            <h4 class="font-semibold text-gray-900 mb-2">{{ cls.name }}</h4>
            <p class="text-sm text-gray-600 mb-3">{{ cls.description }}</p>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span class="flex items-center space-x-2 rtl:space-x-reverse">
                  <Users class="w-4 h-4" />
                  <span>{{ cls.students }} طالب</span>
                </span>
                <span class="flex items-center space-x-2 rtl:space-x-reverse">
                  <Video class="w-4 h-4" />
                  <span>{{ cls.videos.length }} فيديو</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Announcements -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Bell class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">الإعلانات الحديثة</h3>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="announcement in platformStore.announcements"
            :key="announcement.id"
            class="border-r-4 border-blue-500 bg-blue-50 p-4 rounded-lg"
          >
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-semibold text-gray-900">{{ announcement.title }}</h4>
              <button
                @click="deleteAnnouncement(announcement.id)"
                class="text-red-600 hover:text-red-800"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            <p class="text-gray-700 mb-2">{{ announcement.content }}</p>
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ announcement.author }}</span>
              <span>{{ announcement.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { 
  Droplets, 
  LogOut, 
  Users, 
  BookOpen, 
  Video, 
  Bell, 
  Megaphone,
  Trash2
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()

const newAnnouncement = ref({
  title: '',
  content: ''
})

const totalStudents = computed(() => {
  return platformStore.classes.reduce((total, cls) => total + cls.students, 0)
})

const totalVideos = computed(() => {
  return platformStore.classes.reduce((total, cls) => total + cls.videos.length, 0)
})

const logout = () => {
  authStore.logout()
  router.push('/')
}

const addAnnouncement = () => {
  const result = await platformStore.addAnnouncement({
    title: newAnnouncement.value.title,
    content: newAnnouncement.value.content,
    author: authStore.user.name
  })
  
  if (result.success) {
    // Reset form
    newAnnouncement.value = { title: '', content: '' }
    alert('تم نشر الإعلان بنجاح!')
  } else {
    alert('حدث خطأ أثناء نشر الإعلان')
  }
}

const deleteAnnouncement = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
    const result = await platformStore.deleteAnnouncement(id)
    if (!result.success) {
      alert('حدث خطأ أثناء حذف الإعلان')
    }
  }
}

const viewClass = (classId) => {
  router.push(`/class/${classId}`)
}
</script>