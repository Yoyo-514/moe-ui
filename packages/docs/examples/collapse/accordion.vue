<template>
  <moe-collapse v-model="activeName" accordion>
    <moe-collapse-item name="design" title="设计原则">
      保持轻盈、清爽、类型友好，让组件在可爱和专业之间取得平衡。
    </moe-collapse-item>
    <moe-collapse-item name="engineering" title="工程原则">
      遵循 KISS、YAGNI、DRY 和 SOLID，优先保证长期可维护性。
    </moe-collapse-item>
    <moe-collapse-item name="docs" title="文档原则">
      示例优先展示真实用法，API 表格保持简洁准确。
    </moe-collapse-item>
  </moe-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeName = ref('design')
</script>
