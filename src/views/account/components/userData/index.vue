<script setup>
import { useTheme } from 'vuetify'
import { computed, onMounted, ref, watch } from 'vue'
import { auth, testRule } from '@/rules'
import { vue3starterAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'
import { vue3starterAppSetupStore } from '@/store/appSetup'
import { getFirebaseStorageDownloadURL } from '@/utils'

const { t } = useI18n()
const theme = useTheme()
const themeColors = computed(() => theme.global.current.value.colors)
let picture = ref('')
let email = ref('')
let name = ref('')
let password = ref('')
let showPassword = ref(false)

const authStore = vue3starterAuthStore()
const appSetupStore = vue3starterAppSetupStore()
const isLoadingAuth = computed(() => authStore.isLoadingAuth)
const isUploadingProfilePhoto = computed(
  () => authStore.isUploadingProfilePhoto,
)
const updatingProfile = computed(() => authStore.isUpdatingProfile)
const user = computed(() => authStore.getAuth)

watch(isLoadingAuth, async (loadingAuth) => {
  if (!loadingAuth) await setData()
})

onMounted(() => {
  if (!isLoadingAuth.value) setData()
})

async function setData() {
  email.value = user.value.email
  name.value = user.value.displayName
  picture.value = await getFirebaseStorageDownloadURL(user.value.photoURL)
}

async function messenger(response) {
  appSetupStore
    .setDialogMessage({
      title: response.status ? t('words.success') : t('words.error'),
      text: response.status
        ? t('messages.datas_updated_successfully')
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
}

async function save() {
  if (email.value !== user.value.email) {
    await testRule(auth.email, email.value).then((errors) => {
      if (errors.length === 0) {
        authStore.updateEmail(email.value).then((response) => {
          messenger(response)
        })
      }
    })
  }
  if (name.value !== user.value.displayName) {
    await testRule(auth.name, name.value).then((errors) => {
      if (errors.length === 0) {
        authStore
          .updateProfile(name.value, user.value.photoURL)
          .then((response) => {
            messenger(response)
          })
      }
    })
  }
  if (password.value !== '') {
    await testRule(auth.password, password.value).then((errors) => {
      if (errors.length === 0) {
        authStore.updatePassword(password.value).then((response) => {
          messenger(response)
        })
      }
    })
  }
}

async function onFilePicked(e) {
  if (e.target.files.length === 1) {
    authStore.updateProfilePhoto(e.target.files[0]).then((response) => {
      messenger(response).then(() => {
        setData()
      })
    })
  }
}
</script>
<template>
  <v-card variant="outlined">
    <v-parallax
      height="100"
      :style="{
        backgroundImage: `linear-gradient(to top right, ${themeColors['primary-darken-1']}99, ${themeColors['primary']}F2), url('https://picsum.photos/800/100?random')`,
      }"
    ></v-parallax>
    <div class="d-flex justify-center" style="margin-top: -75px; height: 80px">
      <v-hover v-slot="{ isHovering, props }">
        <v-avatar
          size="100"
          color="white"
          class="bg-white"
          :class="`elevation-${isHovering ? 3 : 1}`"
          style="cursor: pointer"
          variant="outlined"
          v-bind="props"
          @click="$refs.fileUpload.click()"
        >
          <v-row
            v-if="isLoadingAuth || isUploadingProfilePhoto"
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              width="3"
              size="35"
              indeterminate
              color="primary"
            />
          </v-row>
          <div v-else>
            <v-icon v-if="isHovering" size="50" color="primary"
              >mdi-camera</v-icon
            >
            <v-img v-else-if="picture" contain :src="picture">
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    width="3"
                    size="40"
                    indeterminate
                    color="primary"
                  />
                </v-row>
              </template>
            </v-img>
            <v-icon v-else size="70" :color="isHovering ? 'red' : 'primary'"
              >mdi-account</v-icon
            >
          </div>
        </v-avatar>
      </v-hover>
      <!-- Input File -->
      <input
        ref="fileUpload"
        class="d-none"
        type="file"
        accept="image/png, image/jpeg"
        @change="onFilePicked"
      />
    </div>
    <v-card-text class="pt-9">
      <v-text-field
        v-model="name"
        :label="$t('words.name')"
        :rules="auth.name"
        hide-details="auto"
        :disabled="updatingProfile"
        :loading="isLoadingAuth"
        class="mb-4"
        outlined
        type="text"
        variant="outlined"
        density="compact"
      >
        <template #message="{ message }"> {{ $t(message) }} </template>
      </v-text-field>
      <v-text-field
        v-model="email"
        :label="$t('words.email')"
        :rules="auth.email"
        hide-details="auto"
        :disabled="updatingProfile"
        :loading="isLoadingAuth"
        class="mb-4"
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
        :rules="auth.passwordUpdate"
        :disabled="updatingProfile || isLoadingAuth"
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
      <v-btn
        color="primary"
        :block="true"
        :flat="true"
        :loading="updatingProfile"
        :disabled="isLoadingAuth || updatingProfile"
        type="submit"
        class="mt-4"
        @click="save"
      >
        {{ $t('words.save') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>
