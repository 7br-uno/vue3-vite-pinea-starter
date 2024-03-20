import { defineStore } from 'pinia'
import i18n from '@/plugins/i18n'
import { db } from '@/config/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export const vue3starterSettingsStore = defineStore('vue3starterSettings', {
  state: () => ({
    language: localStorage.getItem('language') || 'en',
    theme: localStorage.getItem('theme') || 'device',
    setingLanguage: false,
    setingTheme: false,
  }),
  getters: {
    getLanguage: (state) => state.language,
    getTheme: (state) => state.theme,
    isSetingLanguage: (state) => state.setingLanguage,
    isSetingTheme: (state) => state.setingTheme,
  },
  actions: {
    async setLanguage(language, uid = null) {
      this.language = language
      localStorage.setItem('language', language)
      i18n.global.locale.value = language
      if (uid) {
        this.setingLanguage = true
        return await this.saveSettings(uid).finally(() => {
          this.setingLanguage = false
        })
      }
    },

    async setTheme(theme, uid = null) {
      this.theme = theme
      localStorage.setItem('theme', theme)
      if (uid) {
        this.setingTheme = true
        return await this.saveSettings(uid).finally(() => {
          this.setingTheme = false
        })
      }
    },

    async saveSettings(uid) {
      return await updateDoc(doc(db, 'app_setup', uid), {
        language: this.language,
        theme: this.theme,
      })
        .then(() => {
          return { status: true, message: '' }
        })
        .catch((error) => {
          if (error) return { status: false, message: error.message }
        })
    },

    async fetchSettings(uid) {
      return await getDoc(doc(db, 'app_setup', uid))
        .then((response) => {
          const obj = response.data()
          Object.keys(obj).forEach((key) =>
            this['set' + key.charAt(0).toUpperCase() + key.slice(1)](
              obj[key],
              null,
            ),
          )
          return true
        })
        .catch((error) => {
          if (error) return error
        })
    },
  },
})
