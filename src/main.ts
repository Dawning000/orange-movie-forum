import { createApp } from 'vue'
import { createPinia } from 'pinia'
import type { App as VueApp } from 'vue'
import router from './router'
import App from './App.vue'
import './style/main.scss'

const app: VueApp = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
