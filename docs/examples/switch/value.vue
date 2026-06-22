<template>
  <div class="switch-demo-column">
    <moe-switch v-model="status" active-value="enabled" inactive-value="disabled" />
    <span>当前值：{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref('enabled')
</script>

<style scoped>
.switch-demo-column {
  display: grid;
  gap: 12px;
}
</style>
