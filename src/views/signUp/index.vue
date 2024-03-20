<script setup>
import { ref, computed, watch } from 'vue'
import { vue3starterAuthStore } from '@/store/auth'
import { vue3starterAppSetupStore } from '@/store/appSetup'
import { auth } from '@/rules'
import { vue3starterSettingsStore } from '@/store/settings'
import { languages } from '@/metadata'
import { useI18n } from 'vue-i18n'
import router from '@/router'

const { t } = useI18n()
const authStore = vue3starterAuthStore()
const appSetupStore = vue3starterAppSetupStore()
let name = ref('')
let email = ref('')
let password = ref('')
let showPassword = ref(false)
let validForm = ref(false)
const signingUp = computed(() => authStore.isSigningUp)

async function signUp() {
  await authStore
    .signUp(email.value, password.value, name.value, language.value)
    .then((response) => {
      appSetupStore
        .setDialogMessage({
          title: response.status ? t('words.success') : t('words.error'),
          text: response.status
            ? t('messages.please_check_your_email_to_confirm_your_account')
            : response.message,
          primary: {
            text: response.status ? 'Ok' : t('words.close'),
            click: () =>
              response.status
                ? router
                    .push('/')
                    .then(() => appSetupStore.closeDialogMessage())
                : appSetupStore.closeDialogMessage(),
          },
          hideCloseBtn: true,
          prependIcon: response.status
            ? { icon: 'mdi-check-circle', color: 'success' }
            : { icon: 'mdi-alert-circle', color: 'error' },
        })
        .then(() => {
          appSetupStore.showDialogMessage()
        })
    })
}

const settingsStore = vue3starterSettingsStore()
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
        <v-card-title class="pb-0">{{ $t('words.sign_up') }}</v-card-title>
        <v-card-subtitle>vue3starter</v-card-subtitle>
        <v-card-text>
          <v-form v-model="validForm" @submit.prevent="signUp()">
            <v-text-field
              v-model="name"
              :label="$t('words.name')"
              :rules="auth.name"
              variant="outlined"
              hide-details="auto"
              density="compact"
              class="mb-3"
              outlined
              type="text"
            >
              <template #message="{ message }"> {{ $t(message) }} </template>
            </v-text-field>
            <v-text-field
              v-model="email"
              :label="$t('words.email')"
              :rules="auth.email"
              variant="outlined"
              hide-details="auto"
              density="compact"
              class="mb-3"
              outlined
              type="email"
            >
              <template #message="{ message }"> {{ $t(message) }} </template>
            </v-text-field>
            <v-text-field
              v-model="password"
              :label="$t('words.password')"
              :rules="auth.password"
              hide-details="auto"
              class="mb-3"
              variant="outlined"
              density="compact"
              outlined
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
            >
              <template #message="{ message }"> {{ $t(message) }} </template>
            </v-text-field>
            <v-btn
              color="primary"
              :block="true"
              :flat="true"
              :loading="signingUp"
              :disabled="!validForm"
              type="submit"
              class="mb-2"
            >
              {{ $t('words.sign_up') }}
            </v-btn>
            <v-row class="mt-2">
              <v-col class="d-flex align-center">
                <v-btn
                  color="primary"
                  :block="true"
                  :disabled="signingUp"
                  variant="tonal"
                  @click="$router.push('/sign-in')"
                >
                  {{ $t('words.sign_in') }}
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
