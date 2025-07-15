<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <Droplets class="w-8 h-8 text-blue-600" />
            <div>
              <h1 class="text-xl font-semibold text-gray-900">لوحة المدرب</h1>
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
      <!-- Trainer Info -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <UserCheck class="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ authStore.user?.name }}</h2>
            <p class="text-gray-600">مدرب {{ authStore.user?.specialization }}</p>
          </div>
        </div>
      </div>

      <!-- Upload Video Section -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Upload class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">رفع فيديو جديد</h3>
        </div>
        
        <form @submit.prevent="uploadVideo" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الفيديو</label>
              <input
                v-model="newVideo.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل عنوان الفيديو"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الفئة المستهدفة</label>
              <select
                v-model="newVideo.classId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الفئة المستهدفة</option>
                <option
                  v-for="cls in platformStore.classes"
                  :key="cls.id"
                  :value="cls.id"
                >
                  {{ cls.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">مدة الفيديو</label>
            <input
              v-model="newVideo.duration"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: 45:30"
            />
          </div>

          <!-- Video Upload Method -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">طريقة رفع الفيديو</label>
            <div class="flex space-x-4 rtl:space-x-reverse mb-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="uploadMethod"
                  value="file"
                  class="mr-2 ml-2"
                />
                <span>رفع ملف فيديو</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="uploadMethod"
                  value="url"
                  class="mr-2 ml-2"
                />
                <span>رابط فيديو</span>
              </label>
            </div>

            <!-- File Upload -->
            <div v-if="uploadMethod === 'file'">
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Video class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600 mb-2">اسحب الفيديو هنا أو انقر للاختيار</p>
                <input
                  type="file"
                  accept="video/*"
                  class="hidden"
                  ref="fileInput"
                  @change="handleFileSelect"
                />
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  اختيار فيديو
                </button>
              </div>
              <p v-if="selectedFile" class="mt-2 text-sm text-green-600">
                تم اختيار: {{ selectedFile.name }}
              </p>
            </div>

            <!-- URL Input -->
            <div v-if="uploadMethod === 'url'">
              <input
                v-model="newVideo.videoUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل رابط الفيديو (YouTube, Vimeo, إلخ)"
              />
              <p class="mt-2 text-sm text-gray-500">
                يمكنك إدخال رابط من YouTube أو Vimeo أو أي منصة فيديو أخرى
              </p>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            رفع الفيديو
          </button>
        </form>
      </div>

      <!-- Classes Overview -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <BookOpen class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">الصفوف الدراسية</h3>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { 
  Droplets, 
  LogOut, 
  UserCheck, 
  Upload, 
  Video, 
  BookOpen, 
  Users 
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()

const newVideo = ref({
  title: '',
  classId: '',
  duration: '',
  videoUrl: ''
})

const uploadMethod = ref('file')
const selectedFile = ref(null)

const logout = () => {
  authStore.logout()
  router.push('/')
}

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadVideo = () => {
  if (uploadMethod.value === 'file' && !selectedFile.value) {
    alert('يرجى اختيار ملف فيديو')
    return
  }
  
  if (uploadMethod.value === 'url' && !newVideo.value.videoUrl) {
    alert('يرجى إدخال رابط الفيديو')
    return
  }

  const video = {
    title: newVideo.value.title,
    duration: newVideo.value.duration,
    trainer: authStore.user.name,
    videoUrl: uploadMethod.value === 'url' ? newVideo.value.videoUrl : null,
    fileName: uploadMethod.value === 'file' ? selectedFile.value?.name : null
  }

  platformStore.addVideo(newVideo.value.classId, video)
  
  // Reset form
  newVideo.value = { title: '', classId: '', duration: '', videoUrl: '' }
  selectedFile.value = null
  uploadMethod.value = 'file'
  
  alert('تم رفع الفيديو بنجاح!')
}

const viewClass = (classId) => {
  router.push(`/class/${classId}`)
}
</script>