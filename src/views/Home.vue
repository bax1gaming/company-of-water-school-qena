<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
    <!-- Header -->
    <header class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Droplets class="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">المنصة الرسمية</h1>
              <p class="text-sm text-gray-600">لطلاب مياه الشرب والصرف الصحي بقنا</p>
            </div>
          </div>
          <router-link
            to="/login"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            تسجيل الدخول
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-6">
          منصة التعلم الإلكتروني المتطورة
        </h2>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          منصة شاملة لتعليم طلاب مياه الشرب والصرف الصحي بأحدث الطرق التعليمية والتقنيات المتقدمة
        </p>
        <div class="grid md:grid-cols-3 gap-8 mt-16">
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <GraduationCap class="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 class="text-xl font-semibold mb-3">تعليم متخصص</h3>
            <p class="text-gray-600">مناهج متخصصة في مياه الشرب والصرف الصحي</p>
          </div>
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <Video class="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 class="text-xl font-semibold mb-3">محتوى مرئي</h3>
            <p class="text-gray-600">فيديوهات تعليمية عالية الجودة من أفضل المدربين</p>
          </div>
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <Users class="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 class="text-xl font-semibold mb-3">تفاعل مباشر</h3>
            <p class="text-gray-600">تواصل مباشر مع المدربين والزملاء</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Classes Overview -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-3xl font-bold text-center text-gray-900 mb-12">الصفوف الدراسية</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <h4 class="text-xl font-semibold text-blue-900 mb-2">الصف الأول</h4>
            <p class="text-blue-700">تخصص عام - المبادئ الأساسية</p>
          </div>
          <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl">
            <h4 class="text-xl font-semibold text-cyan-900 mb-2">الصف الثاني</h4>
            <p class="text-cyan-700">تخصص مياه شرب وصرف صحي</p>
          </div>
          <div class="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl">
            <h4 class="text-xl font-semibold text-teal-900 mb-2">الصف الثالث</h4>
            <p class="text-teal-700">التخصص المتقدم</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-4">
          <Droplets class="w-8 h-8" />
          <h4 class="text-xl font-semibold">المنصة الرسمية لطلاب مياه الشرب والصرف الصحي بقنا</h4>
        </div>
        <p class="text-gray-400">جميع الحقوق محفوظة © 2025</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { Droplets, GraduationCap, Video, Users } from 'lucide-vue-next'
</script>