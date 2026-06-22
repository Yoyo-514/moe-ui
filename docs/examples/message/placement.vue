<template>
  <div class="message-demo">
    <moe-button type="primary" @click="openTop">顶部消息</moe-button>
    <moe-button type="success" @click="openBottom">底部消息</moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeMessage } from '@moe-ui/components'

function openTop() {
  MoeMessage.primary({
    message: '这是一条顶部消息',
    placement: 'top',
  })
}

function openBottom() {
  MoeMessage.success({
    message: '这是一条底部消息',
    placement: 'bottom',
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
