<template>
  <moe-button @click="open">自定义图标</moe-button>
</template>

<script setup lang="ts">
import { MoeMessageBox } from '@moe-ui/components'

const open = () => {
  MoeMessageBox.alert('可以通过 icon 和 closeIcon 自定义图标。', '自定义图标', {
    icon: 'mingcute:star-line',
    closeIcon: 'mingcute:close-circle-line',
  })
}
</script>
