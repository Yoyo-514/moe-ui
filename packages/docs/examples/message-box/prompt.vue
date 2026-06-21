<template>
  <moe-button @click="open">新建项目</moe-button>
</template>

<script setup lang="ts">
import { MoeMessage, MoeMessageBox } from '@moe-ui/components'

const open = () => {
  MoeMessageBox.prompt('请输入项目名称', '新建项目', {
    inputPlaceholder: '例如：moe-ui',
    inputValidator: (value) => (value.trim() ? true : '项目名称不能为空'),
  })
    .then((result) => {
      if (typeof result === 'object') {
        MoeMessage.success(`已创建：${result.value}`)
      }
    })
    .catch(() => {
      MoeMessage.info('已取消创建')
    })
}
</script>
