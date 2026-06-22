<template>
  <div class="notification-demo">
    <moe-button
      type="primary"
      @click="MoeNotification.primary({ title: 'Primary', message: '主色通知' })"
    >
      Primary
    </moe-button>
    <moe-button
      type="success"
      @click="MoeNotification.success({ title: 'Success', message: '成功通知' })"
    >
      Success
    </moe-button>
    <moe-button
      type="warning"
      @click="MoeNotification.warning({ title: 'Warning', message: '警告通知' })"
    >
      Warning
    </moe-button>
    <moe-button type="info" @click="MoeNotification.info({ title: 'Info', message: '信息通知' })">
      Info
    </moe-button>
    <moe-button
      type="danger"
      @click="MoeNotification.danger({ title: 'Danger', message: '危险通知' })"
    >
      Danger
    </moe-button>
    <moe-button
      type="danger"
      plain
      @click="MoeNotification.error({ title: 'Error', message: 'error 是 danger 的别名' })"
    >
      Error alias
    </moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeNotification } from '@moe-ui/components'
</script>

<style scoped>
.notification-demo {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
