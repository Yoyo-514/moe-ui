<template>
  <div class="checkbox-demo-column">
    <moe-checkbox-group v-model="checkedList" size="large">
      <moe-checkbox value="large">Large</moe-checkbox>
    </moe-checkbox-group>
    <moe-checkbox-group v-model="checkedList">
      <moe-checkbox value="default">Default</moe-checkbox>
    </moe-checkbox-group>
    <moe-checkbox-group v-model="checkedList" size="small">
      <moe-checkbox value="small">Small</moe-checkbox>
    </moe-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checkedList = ref(['default'])
</script>

<style scoped>
.checkbox-demo-column {
  display: grid;
  gap: 12px;
}
</style>
