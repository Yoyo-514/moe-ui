<template>
  <moe-button type="danger" @click="open">删除文件</moe-button>
</template>

<script setup lang="ts">
import { MoeMessage, MoeMessageBox } from '@moe-ui/components'

const open = () => {
  MoeMessageBox.confirm('文件删除后不可恢复，是否继续？', '危险操作', {
    type: 'warning',
    confirmButtonText: '继续删除',
    cancelButtonText: '取消',
  })
    .then(() => {
      MoeMessage.success('已确认删除')
    })
    .catch(() => {
      MoeMessage.info('已取消删除')
    })
}
</script>
