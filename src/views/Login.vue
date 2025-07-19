<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
          <Droplets class="w-10 h-10 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900">
          {{ isSignup ? 'إنشاء حساب جديد' : 'تسجيل الدخول' }}
        </h2>
        <p class="mt-2 text-gray-600">المنصة الرسمية لطلاب مياه الشرب والصرف الصحي</p>
      </div>

      <form @submit.prevent="isSignup ? handleSignup() : handleLogin()" class="mt-8 space-y-6">
        <div class="bg-white p-8 rounded-xl shadow-lg space-y-6">
          <!-- Login Form -->
          <div v-if="!isSignup">
            <label for="identifier" class="block text-sm font-medium text-gray-700 mb-2">
              اسم المستخدم / كود الطالب / رقم الهاتف / البريد الإلكتروني
            </label>
            <input
              id="identifier"
              v-model="identifier"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل بيانات الدخول"
            />
          </div>

          <!-- Signup Form -->
          <div v-if="isSignup" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل
              </label>
              <input
                id="name"
                v-model="signupData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                اسم المستخدم
              </label>
              <input
                id="username"
                v-model="signupData.username"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسم المستخدم"
              />
            </div>

            <div>
              <label for="studentCode" class="block text-sm font-medium text-gray-700 mb-2">
                كود الطالب
              </label>
              <input
                id="studentCode"
                v-model="signupData.studentCode"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل كود الطالب"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <input
                id="phone"
                v-model="signupData.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل رقم الهاتف"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                v-model="signupData.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>

            <div>
              <label for="class" class="block text-sm font-medium text-gray-700 mb-2">
                الصف الدراسي
              </label>
              <select
                id="class"
                v-model="signupData.class"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر الصف</option>
                <option value="first-general">الصف الأول - تخصص عام</option>
                <option value="second-water">الصف الثاني - تخصص مياه شرب</option>
                <option value="second-sewage">الصف الثاني - تخصص صرف صحي</option>
                <option value="third-water">الصف الثالث - تخصص مياه شرب</option>
                <option value="third-sewage">الصف الثالث - تخصص صرف صحي</option>
              </select>
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              id="password"
              v-model="passwordModel"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
          </div>

          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {{ success }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            <span v-if="loading">{{ isSignup ? 'جاري إنشاء الحساب...' : 'جاري تسجيل الدخول...' }}</span>
            <span v-else>{{ isSignup ? 'إنشاء حساب' : 'تسجيل الدخول' }}</span>
          </button>

          <div class="text-center">
            <button
              type="button"
              @click="toggleMode"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              {{ isSignup ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد' }}
            </button>
          </div>
        </div>
      </form>

      <!-- Demo Accounts -->
      <div v-if="!isSignup" class="bg-white p-6 rounded-xl shadow-lg">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">حسابات تجريبية:</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="font-medium">طالب:</span>
            <span class="text-gray-600">student1 / 123456</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">مدرب:</span>
            <span class="text-gray-600">trainer1 / 123456</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">مدير:</span>
            <span class="text-gray-600">admin / 123456</span>
          </div>
          <div class="text-xs text-gray-500 mt-2">
            يمكن تسجيل الدخول باستخدام: اسم المستخدم، كود الطالب، رقم الهاتف، أو البريد الإلكتروني
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
import { Droplets } from 'lucide-vue-next'

const router = useRouter()
    error.value = ''
    
    const result = await authStore.login(identifier.value, password.value)
    
    if (result.success) {
      // Router navigation will be handled by auth state change
      const user = authStore.user
      switch (user?.role) {
        case 'student':
          router.push('/student')
          break
        case 'trainer':
          router.push('/trainer')
    error.value = ''
    success.value = ''

    const userData = {
      ...signupData.value,
      className: getClassNameById(signupData.value.class)
    }
    
    const result = await authStore.signup(userData)
    
    if (result.success) {
      success.value = result.message
      // Reset form
      signupData.value = {
        name: '',
        username: '',
        studentCode: '',
        phone: '',
        email: '',
        class: '',
        password: ''
      }
      // Switch to login mode after 2 seconds
      setTimeout(() => {
        isSignup.value = false
        success.value = ''
      }, 2000)
    } else {
      error.value = result.message
    }
  }
})

          router.push('/student')
          break
        case 'trainer':
          router.push('/trainer')
          break
        case 'admin':
          router.push('/admin')
          break
        default:
          router.push('/')
      }
    } else {
      error.value = 'بيانات الدخول أو كلمة المرور غير صحيحة'
    }
  } catch (err) {
    error.value = 'حدث خطأ أثناء تسجيل الدخول'
  } finally {
    loading.value = false
  }
}

const handleSignup = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const userData = {
      ...signupData.value,
      className: getClassNameById(signupData.value.class)
    }
    
    const result = authStore.signup(userData)
    
    if (result.success) {
      success.value = result.message
      // Reset form
      signupData.value = {
        name: '',
        username: '',
        studentCode: '',
        phone: '',
        email: '',
        class: '',
        password: ''
      }
      // Switch to login mode after 2 seconds
      setTimeout(() => {
        isSignup.value = false
        success.value = ''
      }, 2000)
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'حدث خطأ أثناء إنشاء الحساب'
  } finally {
    loading.value = false
  }
}
</script>