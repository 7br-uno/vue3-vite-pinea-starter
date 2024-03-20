import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from '@/plugins/i18n'
import { loadFonts } from './plugins/webfontloader'
import { pinia } from '@/config/pinia'
import router from '@/router'

loadFonts()
bootstrap()

function bootstrap() {
  createApp(App).use(vuetify).use(router).use(pinia).use(i18n).mount('#app')
}
