<template>
  <div class="message-demo">
    <moe-button type="primary" @click="MoeMessage.primary('Primary 主色消息')">Primary</moe-button>
    <moe-button type="success" @click="MoeMessage.success('Success 成功消息')">Success</moe-button>
    <moe-button type="warning" @click="MoeMessage.warning('Warning 警告消息')">Warning</moe-button>
    <moe-button type="info" @click="MoeMessage.info('Info 信息消息')">Info</moe-button>
    <moe-button type="danger" @click="MoeMessage.danger('Danger 危险消息')">Danger</moe-button>
    <moe-button type="danger" plain @click="MoeMessage.error('Error 会作为 danger 别名')">
      Error alias
    </moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeMessage } from '@moe-ui/components'
</script>

<style scoped>
.message-demo {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
