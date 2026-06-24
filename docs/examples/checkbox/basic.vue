<template>
  <div class="checkbox-demo-column">
    <moe-checkbox v-model="checked">同意用户协议</moe-checkbox>
    <span>当前值：{{ checked }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
</script>

<style scoped>
.checkbox-demo-column {
  display: grid;
  gap: 12px;
}
</style>
