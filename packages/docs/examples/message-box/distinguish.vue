<template>
  <moe-button @click="open">区分关闭动作</moe-button>
</template>

<script setup lang="ts">
import { MoeMessage, MoeMessageBox } from '@moe-ui/components'

const open = () => {
  MoeMessageBox.confirm('取消按钮和关闭按钮会返回不同 action。', '区分动作', {
    distinguishCancelAndClose: true,
  })
    .then(() => {
      MoeMessage.success('点击了确认')
    })
    .catch((action) => {
      MoeMessage.info(`关闭动作：${action}`)
    })
}
</script>
