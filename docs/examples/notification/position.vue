<template>
  <div class="notification-demo">
    <moe-button @click="open('top-right')">top-right</moe-button>
    <moe-button @click="open('top-left')">top-left</moe-button>
    <moe-button @click="open('bottom-right')">bottom-right</moe-button>
    <moe-button @click="open('bottom-left')">bottom-left</moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeNotification } from '@moe-ui/components'
import type { NotificationPosition } from '@moe-ui/components'

function open(position: NotificationPosition) {
  MoeNotification({
    title: position,
    message: '可以通过 position 控制通知弹出的位置',
    position,
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
