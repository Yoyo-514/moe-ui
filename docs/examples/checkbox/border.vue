<template>
  <div class="checkbox-demo-row">
    <moe-checkbox v-model="checked1" border>备选项 1</moe-checkbox>
    <moe-checkbox v-model="checked2" border>备选项 2</moe-checkbox>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked1 = ref(true)
const checked2 = ref(false)
</script>

<style scoped>
.checkbox-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
