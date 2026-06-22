<template>
  <div class="message-demo">
    <moe-button type="primary" @click="openMessage">单独引用</moe-button>
  </div>
</template>

<script setup lang="ts">
import { MoeMessage } from '@moe-ui/components'

function openMessage() {
  MoeMessage.success('可以从 @moe-ui/components 单独引用 MoeMessage')
}
</script>

<style scoped>
.message-demo {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
