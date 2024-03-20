<script setup>
import { vue3starterAuthStore } from '@/store/auth'
import { vue3starterAppSetupStore } from '@/store/appSetup'
import router from '@/router'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
const authStore = vue3starterAuthStore()
const appSetupStore = vue3starterAppSetupStore()
const { t } = useI18n()
const isUserSignedIn = ref(false)
const isRefreshingPage = ref(false)

onMounted(() => {
  authStore.isSignedIn().then((user) => {
    isUserSignedIn.value = !!user
    if (router.currentRoute.value.params.code === 'email-not-verified') {
      if (user?.emailVerified) router.push('/')
    }
  })
})

const pageData = computed(() => {
  switch (router.currentRoute.value.params.code) {
    case 'email-not-verified':
      return {
        icon: 'mdi-alert-circle-outline',
        color: 'error',
        title: t('words.attention'),
        message: t('messages.you_must_verify_your_email_to_access_the_account'),
        actions: [
          {
            title: t('words.done'),
            loading: isRefreshingPage.value,
            action: () => {
              isRefreshingPage.value = true
              router.go()
            },
            color: 'primary',
          },
          {
            title: t('messages.send_another_verification_email'),
            loading: authStore.sendingEmailVerification,
            disabled: !isUserSignedIn.value,
            action: () =>
              authStore.sendEmailVerification().then((response) => {
                appSetupStore
                  .setDialogMessage({
                    title: response.status
                      ? t('words.success')
                      : t('words.error'),
                    text: response.status
                      ? t('messages.email_verification_sent')
                      : response.message,
                    primary: {
                      text: t('words.close'),
                      click: () => appSetupStore.closeDialogMessage(),
                    },
                    hideCloseBtn: true,
                    prependIcon: response.status
                      ? { icon: 'mdi-check-circle', color: 'success' }
                      : { icon: 'mdi-alert-circle', color: 'error' },
                  })
                  .then(() => {
                    appSetupStore.showDialogMessage()
                  })
              }),
            color: 'secundary',
          },
          {
            title: t('words.sign_out'),
            action: () => authStore.signOut(),
            color: 'secundary',
          },
        ],
      }
    case 'page-not-found':
      return {
        icon: 'mdi-alert-circle-outline',
        color: 'error',
        title: t('words.error') + ' 404',
        message: t('messages.the_page_you_are_trying_to_access_was_not_found'),
        actions: [
          {
            title: t('messages.return_to_home_page'),
            action: () => router.push('/'),
            color: 'primary',
          },
        ],
      }
    default:
      return {
        icon: 'mdi-alert-circle-outline',
        color: 'error',
        title: t('words.error'),
        message: t('messages.something_whent_wrong_please_try_again_later'),
        actions: [
          {
            title: t('messages.return_to_home_page'),
            action: () => router.push('/'),
            color: 'primary',
          },
        ],
      }
  }
})
</script>
<template>
  <v-layout class="bg-primary" full-height="100%">
    <v-container class="d-flex align-center justify-center">
      <v-card class="text-center pt-2 rounded-lg" color="white" width="400">
        <v-card-title class="pb-0">
          <v-icon size="x-small" class="mb-1" :color="pageData.color">{{
            pageData.icon
          }}</v-icon>
          {{ pageData.title }}
        </v-card-title>
        <v-card-text class="mt-2 mb-0 pb-0">
          {{ pageData.message }}
        </v-card-text>
        <v-card-actions class="d-block">
          <v-btn
            v-for="(action, i) in pageData.actions"
            :key="i"
            :color="action.color"
            :block="true"
            :flat="true"
            :loading="action.loading"
            :disabled="action.disabled"
            variant="tonal"
            class="mx-0 mt-2"
            @click="action.action()"
          >
            {{ action.title }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-layout>
</template>
