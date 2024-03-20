<script setup>
import { computed, ref, watch } from 'vue'
import { vue3starterSettingsStore } from '@/store/settings'
import { vue3starterAuthStore } from '@/store/auth'

const mode = ref(localStorage.getItem('theme') || 'device')
const items = ref([
  { title: 'Device', value: 'device', icon: 'mdi-theme-light-dark' },
  { title: 'Light', value: 'light', icon: 'mdi-white-balance-sunny' },
  { title: 'Dark', value: 'dark', icon: 'mdi-weather-night' },
])

const settingsStore = vue3starterSettingsStore()
const authStore = vue3starterAuthStore()
const user = computed(() => authStore.getAuth)
const isSetingTheme = computed(() => settingsStore.isSetingTheme)

watch(
  mode,
  async (newMode) => await settingsStore.setTheme(newMode, user.value.uid),
)
</script>
<template>
  <v-card
    class="pa-1 v-layout--full-height d-flex flex-column"
    variant="outlined"
  >
    <v-card-title>{{ $t('words.theme') }}</v-card-title>
    <v-card-text>
      {{ $t('messages.customize_your_experience_with_light_and_dark_themes') }}
    </v-card-text>
    <v-card-actions>
      <v-select
        v-model="mode"
        variant="outlined"
        density="compact"
        hide-details
        :loading="isSetingTheme"
        :items="items"
      >
        <template #prepend-inner>
          <v-icon start="" size="small">
            {{ items.filter((i) => i.value === mode)[0].icon }}
          </v-icon>
        </template>
        <template #selection="{ item }">
          <span>{{ item.title }}</span>
        </template>
      </v-select>
    </v-card-actions>
  </v-card>
</template>
