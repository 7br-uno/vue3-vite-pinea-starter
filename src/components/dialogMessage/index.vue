<script setup>
import { computed } from 'vue'
import { vue3starterAppSetupStore } from '@/store/appSetup'

const appSetupStore = vue3starterAppSetupStore()
const dialogMessage = computed(() => appSetupStore.dialogMessage)
</script>
<template>
  <v-dialog v-model="dialogMessage.value" width="auto">
    <v-card
      max-width="400"
      :text="dialogMessage.text"
      :title="dialogMessage.title"
    >
      <template #prepend>
        <v-icon :color="dialogMessage.prependIcon?.color" size="25">{{
          dialogMessage.prependIcon?.icon
        }}</v-icon>
      </template>
      <template #actions>
        <v-btn
          v-if="!dialogMessage.hideCloseBtn"
          class="ms-auto"
          variant="outlined"
          :text="$t('words.close')"
          @click="appSetupStore.closeDialogMessage()"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="dialogMessage.secondary?.text"
          class="mr-1"
          variant="outlined"
          color="secondary"
          :disabled="dialogMessage.secondary?.disabled"
          :loading="dialogMessage.secondary?.loading"
          :text="dialogMessage.secondary?.text"
          @click="dialogMessage.secondary?.click"
        ></v-btn>
        <v-btn
          :block="dialogMessage.hideCloseBtn && !dialogMessage.secondary?.text"
          variant="flat"
          color="primary"
          :disabled="dialogMessage.primary?.disabled"
          :loading="dialogMessage.primary?.loading"
          :text="dialogMessage.primary?.text"
          @click="dialogMessage.primary?.click"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
