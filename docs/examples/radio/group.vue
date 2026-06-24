<template>
  <div class="radio-demo-column">
    <moe-radio-group v-model="value">
      <moe-radio value="sakura">樱粉</moe-radio>
      <moe-radio value="sky">晴空</moe-radio>
      <moe-radio value="violet">藤紫</moe-radio>
    </moe-radio-group>
    <span>当前值：{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('sakura')
</script>

<style scoped>
.radio-demo-column {
  display: grid;
  gap: 12px;
}
</style>
