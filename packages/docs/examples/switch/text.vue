<template>
  <div class="switch-demo-column">
    <moe-switch v-model="value1" active-text="Pay by month" inactive-text="Pay by year" />
    <moe-switch v-model="value2" inline-prompt active-text="是" inactive-text="否" />
    <moe-switch v-model="value3" inline-prompt active-text="Y" inactive-text="N" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(true)
const value3 = ref(false)
</script>

<style scoped>
.switch-demo-column {
  display: grid;
  gap: 12px;
}
</style>
