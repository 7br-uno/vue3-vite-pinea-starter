import { createI18n } from 'vue-i18n'
import messages from '../locales'
const locale = localStorage.getItem('language') || 'en'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages,
})

export default i18n
