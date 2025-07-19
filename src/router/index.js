import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Import views
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
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth to be initialized if it hasn't been yet
  if (authStore.loading) {
    await new Promise(resolve => {
      const unwatch = authStore.$subscribe(() => {
        if (!authStore.loading) {
          unwatch()
          resolve()
        }
      })
    })
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    // Redirect to appropriate dashboard based on user role
    switch (authStore.user?.role) {
      case 'student':
        next('/student')
        break
      case 'trainer':
        next('/trainer')
        break
      case 'admin':
        next('/admin')
        break
      default:
        next('/login')
    }
  } else {
    next()
  }
})

export default router