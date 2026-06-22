<template>
  <div class="notification-demo">
    <moe-button type="primary" @click="openNotification">打开通知</moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeNotification } from '@moe-ui/components'

function openNotification() {
  MoeNotification({
    title: '标题',
    message: '这是一条基础通知消息',
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
