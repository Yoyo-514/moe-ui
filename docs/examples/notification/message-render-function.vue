<template>
  <div class="notification-demo">
    <moe-button type="primary" @click="openNotification">函数形式的 message</moe-button>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

import { MoeNotification } from '@moe-ui/components'

function openNotification() {
  MoeNotification({
    title: '函数消息',
    message: () =>
      h('span', { style: { color: 'var(--moe-color-primary)' } }, 'message 支持返回 VNode 的函数'),
  })
}
</script>

<style scoped>
.notification-demo {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
