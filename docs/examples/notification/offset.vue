<template>
  <div class="notification-demo">
    <moe-button type="primary" @click="openNotification">有位置偏移的通知栏</moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeNotification } from '@moe-ui/components'

function openNotification() {
  MoeNotification({
    title: '偏移通知',
    message: 'offset 可以控制通知距离窗口边缘的距离',
    position: 'top-right',
    offset: 80,
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
