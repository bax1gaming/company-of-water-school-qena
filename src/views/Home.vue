<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
    <!-- Header -->
    <header class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
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
            <div class="w-12 h-12 text-blue-600 mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">تعليم متخصص</h3>
            <p class="text-gray-600">مناهج متخصصة في مياه الشرب والصرف الصحي</p>
          </div>
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <div class="w-12 h-12 text-blue-600 mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">محتوى مرئي</h3>
            <p class="text-gray-600">فيديوهات تعليمية عالية الجودة من أفضل المدربين</p>
          </div>
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <div class="w-12 h-12 text-blue-600 mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2 1l-3 4v2h2l2.54-3.4L16.5 18H20zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 2h-2C3.57 8 2.5 9.57 2.5 11.5V22h2v-6h2v6h2v-6.5c0-1.93-1.07-3.5-2.5-3.5z"/>
              </svg>
            </div>
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
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h4 class="text-xl font-semibold">المنصة الرسمية لطلاب مياه الشرب والصرف الصحي بقنا</h4>
        </div>
        <p class="text-gray-400">جميع الحقوق محفوظة © 2025</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// تم إزالة استيراد الأيقونات واستبدالها بـ SVG مباشرة
</script>