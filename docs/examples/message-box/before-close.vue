<template>
  <moe-button @click="open">beforeClose</moe-button>
</template>

<script setup lang="ts">
import { MoeMessage, MoeMessageBox } from '@moe-ui/components'

const open = () => {
  MoeMessageBox.confirm('关闭前会等待 1 秒。', '关闭前回调', {
    beforeClose: (action, _instance, done) => {
      if (action === 'confirm') {
        setTimeout(() => {
          MoeMessage.success('beforeClose 已完成')
          done()
        }, 1000)
        return
      }

      done()
    },
  })
}
</script>
