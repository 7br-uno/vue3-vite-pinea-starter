<script setup>
import { useTheme } from 'vuetify'
import { computed, onMounted, ref, watch } from 'vue'
import { vue3starterAuthStore } from '@/store/auth'
import { getFirebaseStorageDownloadURL } from '@/utils'

const theme = useTheme()
const authStore = vue3starterAuthStore()

const accountMenuItems = [
  { title: 'words.account', to: '/account', icon: 'mdi-account' },
  { title: 'words.settings', to: '/settings', icon: 'mdi-cog' },
  { title: 'words.sign_out', to: 'signOut', icon: 'mdi-logout' },
]
const profilePhoto = ref(null)

const signingOut = computed(() => authStore.signingOut)
const themeColors = computed(() => theme.global.current.value.colors)
const auth = computed(() => authStore.getAuth)
const isUploadingProfilePhoto = computed(
  () => authStore.isUploadingProfilePhoto,
)

watch(isUploadingProfilePhoto, async (isUploadingProfilePhoto) => {
  if (!isUploadingProfilePhoto) {
    getFirebaseStorageDownloadURL(authStore.getAuth.photoURL).then((url) => {
      profilePhoto.value = url
    })
  }
})

onMounted(() => {
  if (authStore.getAuth.photoURL) {
    getFirebaseStorageDownloadURL(authStore.getAuth.photoURL).then((url) => {
      profilePhoto.value = url
    })
  }
})
</script>
<template>
  <v-layout>
    <v-app-bar
      color="primary"
      image="https://picsum.photos/1920/1080?random"
      elevation="0"
    >
      <template #image>
        <v-img
          :gradient="`to top right, ${themeColors['primary-darken-1']}99, ${themeColors['primary']}F2`"
        ></v-img>
      </template>

      <template #prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>{{
        $t($router.currentRoute.value.meta.title)
      }}</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-menu width="200">
        <template #activator="{ props }">
          <v-avatar
            size="35"
            color="white"
            class="bg-white mr-4"
            :style="{ cursor: 'pointer' }"
            :disabled="true"
            variant="outlined"
            v-bind="props"
          >
            <div>
              <v-img v-if="profilePhoto" contain :src="profilePhoto">
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      width="2"
                      size="20"
                      indeterminate
                      color="primary"
                    />
                  </v-row>
                </template>
              </v-img>
              <v-icon v-else size="28" color="primary">mdi-account</v-icon>
            </div>
          </v-avatar>
        </template>
        <v-list class="rounded-lg">
          <div class="mb-2 mx-3">
            <div class="text-truncate font-weight-bold">
              {{ `${auth.displayName}` }}
            </div>
            <div class="text-truncate text-caption">{{ auth.email }}</div>
          </div>
          <v-list-item
            v-for="(item, i) in accountMenuItems"
            :key="i"
            :active="item.to === $router.currentRoute.value.path"
            @click="
              item.to.startsWith('/')
                ? $router.push(item.to)
                : authStore.signOut()
            "
          >
            <v-list-item-title
              class="d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center">
                <v-icon color="primary" size="small" start>{{
                  item.icon
                }}</v-icon>
                <span>{{ $t(item.title) }}</span>
              </div>
              <v-progress-circular
                v-if="item.to === 'signOut' && signingOut"
                indeterminate
                color="primary"
                width="2"
                class="ml-auto"
                size="x-small"
              ></v-progress-circular>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container class="py-6 px-5">
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>
