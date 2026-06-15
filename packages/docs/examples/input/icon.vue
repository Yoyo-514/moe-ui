<template>
  <div class="input-demo">
    <moe-input v-model="value" prefix-icon="mingcute:user-4-line" placeholder="前缀图标" />
    <moe-input v-model="value" suffix-icon="mingcute:search-line" placeholder="后缀图标" />
    <moe-input v-model="value" placeholder="使用插槽自定义图标">
      <template #prefix>
        <span class="custom-icon">ฅ</span>
      </template>
      <template #suffix>
        <span class="custom-icon">喵</span>
      </template>
    </moe-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
}
.custom-icon {
  color: var(--moe-color-primary);
}
</style>
