<script setup>
import { createApp } from 'vue'
import theme from './components/theme/index.vue'
import language from './components/language/index.vue'

const app = createApp({})
app.component('Theme', theme)
app.component('Language', language)
</script>
<template>
  <v-row>
    <v-col cols="12" sm="6" lg="4">
      <language />
    </v-col>
    <v-col cols="12" sm="6" lg="4">
      <theme />
    </v-col>
  </v-row>
</template>
