import { defineStore } from 'pinia'

const initialDialogMessage = {
  value: false,
  title: '',
  text: '',
  primary: {
    text: '',
    click: () => {},
  },
  secondary: {
    text: '',
    click: () => {},
  },
  hideCloseBtn: true,
  prependIcon: { icon: 'mdi-alert-circle', color: 'error' },
}

export const vue3starterAppSetupStore = defineStore('appSetupStore', {
  state: () => ({
    dialogMessage: initialDialogMessage,
  }),
  getters: {
    getDialogMessage: (state) => state.dialogMessage,
    getDialogMessageValue: (state) => state.dialogMessage.value,
  },
  actions: {
    async setDialogMessage(dialogMessage) {
      return await this.resetDialogMessage().then(() => {
        return (this.dialogMessage = dialogMessage)
      })
    },

    async resetDialogMessage() {
      return (this.dialogMessage = initialDialogMessage)
    },

    async showDialogMessage() {
      return (this.dialogMessage.value = true)
    },

    async closeDialogMessage() {
      return (this.dialogMessage.value = false)
    },
  },
})
