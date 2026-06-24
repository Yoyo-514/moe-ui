<template>
  <div class="checkbox-demo-row">
    <moe-checkbox v-model="checked" disabled>禁用且选中</moe-checkbox>
    <moe-checkbox disabled>禁用未选中</moe-checkbox>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(true)
</script>

<style scoped>
.checkbox-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
