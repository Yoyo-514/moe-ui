<template>
  <div class="switch-demo-row">
    <moe-switch
      v-model="value1"
      inline-prompt
      active-icon="mingcute:check-line"
      inactive-icon="mingcute:close-line"
    />
    <moe-switch
      v-model="value2"
      active-icon="mingcute:sun-line"
      inactive-icon="mingcute:moon-line"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(false)
</script>

<style scoped>
.switch-demo-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
