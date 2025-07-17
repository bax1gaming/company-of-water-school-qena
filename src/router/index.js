import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Import components
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import TrainerDashboard from '../views/TrainerDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import ClassView from '../views/ClassView.vue'
import VideoPlayer from '../views/VideoPlayer.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/student',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/trainer',
    name: 'TrainerDashboard',
    component: TrainerDashboard,
    meta: { requiresAuth: true, role: 'trainer' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/class/:classId',
    name: 'ClassView',
    component: ClassView,
    meta: { requiresAuth: true }
  },
  {
    path: '/video/:videoId',
    name: 'VideoPlayer',
    component: VideoPlayer,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.role && authStore.profile?.role !== to.meta.role) {
    next('/')
  } else {
    next()
  }
})

export default router