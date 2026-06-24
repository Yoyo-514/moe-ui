<template>
  <div class="radio-demo-column">
    <moe-radio-group v-model="value" size="large">
      <moe-radio value="large">Large</moe-radio>
    </moe-radio-group>
    <moe-radio-group v-model="value">
      <moe-radio value="default">Default</moe-radio>
    </moe-radio-group>
    <moe-radio-group v-model="value" size="small">
      <moe-radio value="small">Small</moe-radio>
    </moe-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('default')
</script>

<style scoped>
.radio-demo-column {
  display: grid;
  gap: 12px;
}
</style>
