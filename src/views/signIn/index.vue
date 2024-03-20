<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { vue3starterAuthStore } from '@/store/auth'
import { vue3starterSettingsStore } from '@/store/settings'
import { vue3starterAppSetupStore } from '@/store/appSetup'
import { auth, testRule } from '@/rules'
import { languages } from '@/metadata'
import { useI18n } from 'vue-i18n'
import router from '@/router'

const { t } = useI18n()
const authStore = vue3starterAuthStore()
const appSetupStore = vue3starterAppSetupStore()
const settingsStore = vue3starterSettingsStore()
let email = ref('')
let password = ref('')
let showPassword = ref(false)
let savePassword = ref(false)
let validForm = ref(false)
const signingIn = computed(() => authStore.isSigningIn)
const sendingPasswordResetEmail = computed(
  () => authStore.isSendingPasswordResetEmail,
)

async function recoverPassword() {
  await testRule(auth.email, email.value).then((emailErrors) => {
    appSetupStore
      .setDialogMessage({
        title: t('messages.password_recovery'),
        text:
          emailErrors.length > 0
            ? `${t('messages.not_a_valid_email')}: ${email.value}`
            : 'Enviaremos a recuperação de senha para o e-mail: ' + email.value,
        primary:
          emailErrors.length > 0
            ? {
                text: t('messages.edit_email'),
                click: () => appSetupStore.closeDialogMessage(),
              }
            : {
                text: t('words.confirm'),
                disabled: emailErrors.length > 0,
                loading: sendingPasswordResetEmail,
                click: () =>
                  authStore
                    .sendPasswordResetEmail(email.value)
                    .then((response) => {
                      appSetupStore
                        .setDialogMessage({
                          title: response.status
                            ? t('words.success')
                            : t('words.error'),
                          text: response.status
                            ? t('messages.password_recovery_email_sent')
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
              },
        secondary:
          emailErrors.length > 0
            ? null
            : {
                text: t('messages.edit_email'),
                click: () => appSetupStore.closeDialogMessage(),
              },
        hideCloseBtn: false,
        prependIcon: {
          icon:
            emailErrors.length > 0
              ? 'mdi-alert-circle'
              : 'mdi-information-outline',
          color: emailErrors.length > 0 ? 'error' : 'primary',
        },
      })
      .then(() => {
        appSetupStore.showDialogMessage()
      })
  })
}

async function signIn() {
  if (this.savePassword) {
    localStorage.setItem(
      'amTp094@',
      JSON.stringify({
        zYd4569aW: btoa(email.value),
        krTsK782y: btoa(password.value),
      }),
    )
  } else {
    localStorage.removeItem('amTp094@')
  }
  await authStore.signIn(email.value, password.value).then((response) => {
    if (!response.status) {
      appSetupStore
        .setDialogMessage({
          title: t('words.error'),
          text: response.message,
          primary: {
            text: t('words.close'),
            click: () => appSetupStore.closeDialogMessage(),
          },
          hideCloseBtn: true,
          prependIcon: { icon: 'mdi-alert-circle', color: 'error' },
        })
        .then(() => {
          appSetupStore.showDialogMessage()
        })
    } else router.push('/')
  })
}

onMounted(() => {
  const auth = JSON.parse(localStorage.getItem('amTp094@'))
  if (auth) {
    email.value = atob(auth.zYd4569aW)
    password.value = atob(auth.krTsK782y)
    savePassword.value = true
  }
})

const language = ref(localStorage.getItem('language') || 'en')
const items = ref(languages)
watch(language, async (newLanguage) => {
  settingsStore.setLanguage(newLanguage)
})
</script>
<template>
  <v-layout class="bg-primary" full-height="100%">
    <v-container class="d-flex align-center justify-center">
      <v-card
        class="text-center pt-2 rounded-lg"
        elevation="6"
        color="white"
        width="350"
      >
        <v-card-title class="pb-0">{{ $t('words.sign_in') }}</v-card-title>
        <v-card-subtitle>vue3starter</v-card-subtitle>
        <v-card-text>
          <v-form v-model="validForm" @submit.prevent="signIn()">
            <v-text-field
              v-model="email"
              :label="$t('words.email')"
              :rules="auth.email"
              hide-details="auto"
              class="mb-3"
              outlined
              type="email"
              variant="outlined"
              density="compact"
            >
              <template #message="{ message }"> {{ $t(message) }} </template>
            </v-text-field>
            <v-text-field
              v-model="password"
              :label="$t('words.password')"
              :rules="auth.password"
              hide-details="auto"
              variant="outlined"
              density="compact"
              class="mb-3"
              outlined
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
            >
              <template #message="{ message }"> {{ $t(message) }} </template>
            </v-text-field>
            <div class="d-flex align-center">
              <v-icon
                :color="savePassword ? 'primary' : 'grey'"
                style="padding-bottom: 2px"
                :start="true"
                @click="savePassword = !savePassword"
                >{{
                  savePassword
                    ? 'mdi-checkbox-marked-outline'
                    : 'mdi-checkbox-blank-outline'
                }}</v-icon
              >
              <span
                style="cursor: pointer"
                @click="savePassword = !savePassword"
                >{{ $t('messages.save_password') }}</span
              >
              <v-spacer></v-spacer>
              <span
                class="text-primary text-decoration-underline"
                style="cursor: pointer"
                @click="recoverPassword()"
                >{{ $t('messages.forgot_password') }}</span
              >
            </div>
            <v-btn
              color="primary"
              :block="true"
              :flat="true"
              :loading="signingIn"
              :disabled="!validForm"
              type="submit"
              class="mb-2 mt-3"
            >
              {{ $t('words.sign_in') }}
            </v-btn>
            <v-row class="mt-2">
              <v-col class="d-flex align-center">
                <v-btn
                  color="primary"
                  :block="true"
                  :disabled="signingIn"
                  variant="tonal"
                  @click="$router.push('/sign-up')"
                >
                  {{ $t('words.sign_up') }}
                </v-btn>
              </v-col>
              <v-col>
                <v-select
                  v-model="language"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  hide-details
                  :items="items"
                  background-color="red"
                >
                  <template #prepend-inner>
                    <v-icon start="" size="small"> mdi-translate </v-icon>
                  </template>
                  <template #selection="{ item }">
                    <span class="text-uppercase">{{ item.value }}</span>
                    <span class="ml-2">{{
                      items.filter((i) => i.value === item.value)[0].emoji
                    }}</span>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>
