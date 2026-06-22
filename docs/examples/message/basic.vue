<template>
  <div class="message-demo">
    <moe-button type="primary" @click="openTextMessage">文本消息</moe-button>
    <moe-button @click="openVNodeMessage">VNode 消息</moe-button>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { MoeMessage } from '@moe-ui/components'

function openTextMessage() {
  MoeMessage('这是一条普通文本消息')
}

function openVNodeMessage() {
  MoeMessage({
    message: h('span', { style: { color: 'var(--moe-color-primary)' } }, '这是一条 VNode 消息'),
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
