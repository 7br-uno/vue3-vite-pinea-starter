<script setup>
import { computed, ref, watch } from 'vue'
import { vue3starterSettingsStore } from '@/store/settings'
import { languages } from '@/metadata'
import { vue3starterAuthStore } from '@/store/auth'

const language = ref(localStorage.getItem('language') || 'en')
const items = ref(languages)

const authStore = vue3starterAuthStore()
const user = computed(() => authStore.getAuth)

const settingsStore = vue3starterSettingsStore()
watch(language, async (newLanguage) => {
  await settingsStore.setLanguage(newLanguage, user.value.uid)
})
</script>
<template>
  <v-card
    class="pa-1 v-layout--full-height d-flex flex-column"
    variant="outlined"
  >
    <v-card-title>{{ $t('words.language') }}</v-card-title>
    <v-card-text>
      {{ $t('messages.select_the_language_you_would_like_to_use') }}
    </v-card-text>
    <v-card-actions>
      <v-select
        v-model="language"
        variant="outlined"
        density="compact"
        hide-details
        :items="items"
      >
        <template #prepend-inner>
          <v-icon start="" size="small"> mdi-translate </v-icon>
        </template>
        <template #selection="{ item }">
          <span>{{ item.title }}</span>
          <span class="ml-2">{{
            items.filter((i) => i.value === item.value)[0].emoji
          }}</span>
        </template>
      </v-select>
    </v-card-actions>
  </v-card>
</template>
