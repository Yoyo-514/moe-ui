<template>
  <div class="checkbox-demo-column">
    <moe-checkbox-group v-model="checkedList" :min="1" :max="2">
      <moe-checkbox value="sakura">樱粉</moe-checkbox>
      <moe-checkbox value="sky">晴空</moe-checkbox>
      <moe-checkbox value="violet">藤紫</moe-checkbox>
    </moe-checkbox-group>
    <span>请选择 1 到 2 项：{{ checkedList.join(', ') }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checkedList = ref(['sakura'])
</script>

<style scoped>
.checkbox-demo-column {
  display: grid;
  gap: 12px;
}
</style>
