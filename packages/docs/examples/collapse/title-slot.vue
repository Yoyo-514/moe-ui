<template>
  <moe-collapse v-model="activeNames">
    <moe-collapse-item name="custom-title">
      <template #title>
        <span class="collapse-title">ฅ'ω'ฅ 自定义标题</span>
      </template>
      标题插槽适合放置图标、状态文本或更复杂的标题结构。
    </moe-collapse-item>
  </moe-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeNames = ref(['custom-title'])
</script>

<style scoped>
.collapse-title {
  color: var(--moe-color-primary-strong);
}
</style>
