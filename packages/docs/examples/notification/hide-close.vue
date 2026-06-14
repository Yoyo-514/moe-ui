<template>
  <div class="notification-demo">
    <moe-button type="primary" @click="openNotification">隐藏关闭按钮</moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeNotification } from '@moe-ui/components'

function openNotification() {
  MoeNotification.info({
    title: '不可手动关闭',
    message: 'showClose 为 false 时会隐藏关闭按钮',
    showClose: false,
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
