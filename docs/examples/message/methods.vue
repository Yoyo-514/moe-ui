<template>
  <div class="message-demo">
    <moe-button type="primary" @click="openControlled">打开并保存 handler</moe-button>
    <moe-button @click="closeControlled">关闭上一条</moe-button>
    <moe-button type="danger" plain @click="MoeMessage.closeAll()">关闭全部</moe-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { MoeMessage } from '@moe-ui/components'
import type { MessageHandler } from '@moe-ui/components'

const handler = ref<MessageHandler>()

function openControlled() {
  handler.value = MoeMessage.info({
    message: '这条消息可以通过 handler.close() 关闭',
    duration: 0,
    showClose: true,
  })
}

function closeControlled() {
  handler.value?.close()
  handler.value = undefined
}
</script>

<style scoped>
.message-demo {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
