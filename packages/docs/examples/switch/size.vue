<template>
  <div class="switch-demo-column">
    <moe-switch v-model="value" size="large" active-text="Open" inactive-text="Close" />
    <moe-switch v-model="value" active-text="Open" inactive-text="Close" />
    <moe-switch v-model="value" size="small" active-text="Open" inactive-text="Close" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(true)
</script>

<style scoped>
.switch-demo-column {
  display: grid;
  gap: 12px;
}
</style>
