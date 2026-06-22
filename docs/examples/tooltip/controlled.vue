<template>
  <div class="tooltip-controlled-demo">
    <moe-tooltip v-model:visible="visible" content="受控 Tooltip" trigger="click">
      <moe-button>点击触发</moe-button>
    </moe-tooltip>
    <moe-button type="primary" @click="visible = !visible">
      {{ visible ? '隐藏' : '显示' }} Tooltip
    </moe-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<style scoped>
.tooltip-controlled-demo {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
