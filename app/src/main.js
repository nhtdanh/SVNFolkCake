import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Nora from '@primeuix/themes/aura' // chọn theme Aura (sáng, hiện đại)

import App from './App.vue'
import './assets/style.css'

import VueCookies from 'vue-cookies'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  ripple: true,
  unstyled: false,
  theme: {
    preset: Nora,
  },
})
app.use(ToastService)
app.use(VueCookies)

app.mount('#app')
