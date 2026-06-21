<template>
  <div class="message-box-demo">
    <moe-button @click="open('primary')">Primary</moe-button>
    <moe-button type="success" @click="open('success')">Success</moe-button>
    <moe-button type="warning" @click="open('warning')">Warning</moe-button>
    <moe-button type="danger" @click="open('danger')">Danger</moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeMessageBox, type MessageBoxType } from '@moe-ui/components'

const open = (type: MessageBoxType) => {
  MoeMessageBox.alert(`当前类型：${type}`, '状态提示', { type })
}
</script>

<style scoped>
.message-box-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
