/* eslint-disable no-async-promise-executor */
import { defineStore } from 'pinia'
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  signOut,
} from 'firebase/auth'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { db } from '@/config/firebase'
import { doc, setDoc } from 'firebase/firestore'
import router from '@/router'
import { compressImage } from '@/utils'
import { vue3starterSettingsStore } from '@/store/settings'

export const vue3starterAuthStore = defineStore('vue3starterAuth', {
  state: () => ({
    signingUp: false,
    signingIn: false,
    signingOut: false,
    loadingAuth: false,
    auth: null,
    updatingProfile: false,
    uploadingProfilePhoto: false,
    sendingEmailVerification: false,
    sendingPasswordResetEmail: false,
  }),
  getters: {
    isSigningUp: (state) => state.signingUp,
    isSigningIn: (state) => state.signingIn,
    isSigningOut: (state) => state.signingOut,
    isLoadingAuth: (state) => state.loadingAuth,
    getAuth: (state) => state.auth,
    isUpdatingProfile: (state) => state.updatingProfile,
    isUploadingProfilePhoto: (state) => state.uploadingProfilePhoto,
    isSendingEmailVerification: (state) => state.sendingEmailVerification,
    isSendingPasswordResetEmail: (state) => state.sendingPasswordResetEmail,
  },
  actions: {
    async signUp(email, password, name, language) {
      this.signingUp = true
      return await new Promise(async (resolve, reject) => {
        await createUserWithEmailAndPassword(getAuth(), email, password)
          .then((userCredential) => {
            this.auth = userCredential.user
          })
          .catch((error) => {
            if (error) reject(error.message)
          })

        await this.updateProfile(name, null).catch((error) => {
          if (error) reject(error.message)
        })

        await this.sendEmailVerification().catch((error) => {
          if (error) reject(error.message)
        })

        await setDoc(doc(db, 'app_setup', this.auth.uid), {
          language: language,
          theme: 'device',
        })
          .then(() => {
            resolve({ status: true, message: '' })
          })
          .catch((error) => {
            if (error) reject(error.message)
          })
      })
        .then(() => {
          router.push('/')
          return { status: true, message: '' }
        })
        .catch((errorMessage) => {
          return { status: false, message: errorMessage }
        })
        .finally(() => {
          this.signingUp = false
        })
    },

    async sendEmailVerification() {
      this.sendingEmailVerification = true
      return await sendEmailVerification(getAuth().currentUser)
        .then(() => {
          return { status: true, message: '' }
        })
        .catch((error) => {
          if (error) return { status: false, message: error.message }
        })
        .finally(() => {
          this.sendingEmailVerification = false
        })
    },

    async sendPasswordResetEmail(email) {
      this.sendingPasswordResetEmail = true
      return await sendPasswordResetEmail(getAuth(), email)
        .then(() => {
          return { status: true, message: '' }
        })
        .catch((error) => {
          if (error) return { status: false, message: error.message }
        })
        .finally(() => {
          this.sendingPasswordResetEmail = false
        })
    },

    async updateProfilePhoto(file) {
      this.uploadingProfilePhoto = true
      const compressedImg = await compressImage(file)
      const storageRef = ref(
        getStorage(),
        'profilePhotos/' +
          getAuth().currentUser.uid +
          '.' +
          file.name.split('.').pop(),
      )
      return uploadBytes(storageRef, compressedImg)
        .then((snapshot) => {
          return updateProfile(getAuth().currentUser, {
            displayName: getAuth().currentUser.displayName,
            photoURL: snapshot.metadata.fullPath,
          })
            .then(() => {
              return { status: true, message: '' }
            })
            .catch((error) => {
              if (error) return { status: false, message: error.message }
            })
        })
        .catch((error) => {
          if (error) return { status: false, message: error.message }
        })
        .finally(() => {
          this.uploadingProfilePhoto = false
        })
    },

    async updateProfile(displayName, photoURL) {
      this.updatingProfile = true
      return await updateProfile(getAuth().currentUser, {
        displayName: displayName,
        photoURL: photoURL,
      })
        .then(() => {
          return { status: true, message: '' }
        })
        .catch((error) => {
          if (error) return { status: false, message: error.message }
        })
        .finally(() => {
          this.updatingProfile = false
        })
    },

    async updateEmail(newEmail) {
      this.updatingProfile = true
      return await updateEmail(getAuth().currentUser, newEmail)
        .then(() => {
          return { status: true, message: '' }
        })
        .catch((error) => {
          if (error) return { status: false, message: error.message }
        })
        .finally(() => {
          this.updatingProfile = false
        })
    },

    async updatePassword(newPassword) {
      this.updatingProfile = true
      return await updatePassword(getAuth().currentUser, newPassword)
        .then(() => {
          return { status: true, message: '' }
        })
        .catch((error) => {
          if (error) return { status: false, message: error.message }
        })
        .finally(() => {
          this.updatingProfile = false
        })
    },

    async signIn(email, password) {
      this.signingIn = true
      const settingsStore = vue3starterSettingsStore()
      return await new Promise(async (resolve, reject) => {
        await signInWithEmailAndPassword(getAuth(), email, password)
          .then((userCredential) => (this.auth = userCredential.user))
          .catch((error) => {
            if (error) reject(error.message)
          })

        await settingsStore
          .fetchSettings(this.auth.uid)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            if (error) reject(error.message)
          })
      })
        .then(() => {
          return { status: true, message: '' }
        })
        .catch((errorMessage) => {
          return { status: false, message: errorMessage }
        })
        .finally(() => {
          this.signingIn = false
        })
    },

    async isSignedIn() {
      return await new Promise((resolve) => {
        getAuth().onAuthStateChanged((user) =>
          resolve(user ? (this.auth = user) : false),
        )
      })
    },

    async signOut() {
      this.signingOut = true
      return await signOut(getAuth())
        .then(() => {
          router.push('/sign-in')
        })
        .catch((error) => {
          if (error) console.log(error)
        })
        .finally(() => {
          this.signingOut = false
        })
    },
  },
})
