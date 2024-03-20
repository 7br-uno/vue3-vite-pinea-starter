<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <dialog-message />
    <theme-manager />
  </v-app>
</template>

<script setup>
import dialogMessage from '@/components/dialogMessage/index.vue'
import themeManager from '@/components/themeManager/index.vue'
import { createApp } from 'vue'
const app = createApp({})
app.component('DialogMessage', dialogMessage)
app.component('ThemeManager', themeManager)
</script>
