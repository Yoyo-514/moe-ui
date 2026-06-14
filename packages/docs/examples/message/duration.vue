<template>
  <div class="message-demo">
    <moe-button @click="openFast">1 秒后关闭</moe-button>
    <moe-button type="primary" @click="openPersistent">不自动关闭</moe-button>
    <moe-button type="danger" plain @click="MoeMessage.closeAll()">关闭全部</moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeMessage } from '@moe-ui/components'

function openFast() {
  MoeMessage({
    message: '这条消息会在 1 秒后关闭',
    duration: 1000,
  })
}

function openPersistent() {
  MoeMessage({
    message: 'duration 为 0 时不会自动关闭',
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
