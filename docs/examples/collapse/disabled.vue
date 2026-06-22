<template>
  <moe-collapse v-model="activeNames">
    <moe-collapse-item name="available" title="可用面板">
      当前面板可以正常展开和收起。
    </moe-collapse-item>
    <moe-collapse-item name="disabled" title="禁用面板" disabled>
      禁用面板不会响应点击和键盘操作。
    </moe-collapse-item>
  </moe-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeNames = ref(['available'])
</script>
