<script setup>
import { useTheme } from 'vuetify'
import { computed, onMounted, watch } from 'vue'
import { vue3starterSettingsStore } from '@/store/settings'

const settingsStore = vue3starterSettingsStore()
const theme = useTheme()
const mode = computed(() => settingsStore.getTheme)

watch(mode, async () => setTheme())
onMounted(() => setTheme())

function setTheme() {
  if (mode.value === 'device') {
    theme.global.name.value =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
  } else theme.global.name.value = mode.value
}
//Automatic change
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    if (mode.value === 'device')
      theme.global.name.value = e.matches ? 'dark' : 'light'
  })
</script>
