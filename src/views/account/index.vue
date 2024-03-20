<script setup>
import { createApp } from 'vue'
import userData from './components/userData/index.vue'
const app = createApp({})
app.component('UserData', userData)
</script>
<template>
  <v-row>
    <v-col cols="12" sm="6" offset-sm="3" lg="4" offset-lg="4">
      <user-data />
    </v-col>
  </v-row>
</template>
