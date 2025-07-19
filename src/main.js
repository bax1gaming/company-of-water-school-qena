import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Mount app and handle loading state
app.mount('#app')

// Remove loading state after mount
setTimeout(() => {
  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.classList.add('loaded')
  }
}, 100)