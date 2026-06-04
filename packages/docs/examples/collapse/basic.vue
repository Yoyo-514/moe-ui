<template>
  <moe-collapse v-model="activeNames">
    <moe-collapse-item name="consistency" title="一致性 Consistency">
      与现实生活一致，符合用户习惯；在界面中保持一致的结构和反馈。
    </moe-collapse-item>
    <moe-collapse-item name="feedback" title="反馈 Feedback">
      通过清晰的视觉层级和状态变化，让用户感知当前操作结果。
    </moe-collapse-item>
    <moe-collapse-item name="efficiency" title="效率 Efficiency">
      简化操作路径，帮助用户更快完成任务。
    </moe-collapse-item>
  </moe-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeNames = ref(['consistency'])
</script>
