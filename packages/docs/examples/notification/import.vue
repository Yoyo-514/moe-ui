<template>
  <div class="notification-demo">
    <moe-button type="primary" @click="openNotification">单独引用</moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeNotification } from '@moe-ui/components'

function openNotification() {
  MoeNotification.success({
    title: '单独引用',
    message: '可以从 @moe-ui/components 单独引用 MoeNotification',
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
