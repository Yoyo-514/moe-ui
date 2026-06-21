<template>
  <moe-button @click="open">打开 Alert</moe-button>
</template>

<script setup lang="ts">
import { MoeMessageBox } from '@moe-ui/components'

const open = () => {
  MoeMessageBox.alert('这是一段提示内容', '提示', {
    type: 'success',
  })
}
</script>
