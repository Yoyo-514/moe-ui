<template>
  <div class="message-demo">
    <moe-button type="primary" @click="openClosable">可关闭消息</moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeMessage } from '@moe-ui/components'

function openClosable() {
  MoeMessage.success({
    message: '点击右侧关闭按钮可以立即关闭',
    duration: 0,
    showClose: true,
  })
}
</script>

<style scoped>
.message-demo {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
