import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

// Create app instance
const app = createApp(App)

// Create and use Pinia store
const pinia = createPinia()
app.use(pinia)

// Use router
app.use(router)

// Mount app
app.mount('#app')

// Remove loading state after mount
setTimeout(() => {
  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.classList.add('loaded')
  }
}, 100)