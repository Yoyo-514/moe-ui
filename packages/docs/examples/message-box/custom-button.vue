<template>
  <moe-button @click="open">自定义按钮</moe-button>
</template>

<script setup lang="ts">
import { MoeMessageBox } from '@moe-ui/components'

const open = () => {
  MoeMessageBox.confirm('按钮可以自定义文本、类型、尺寸和圆角。', '自定义按钮', {
    cancelButtonText: '再想想',
    confirmButtonText: '知道了',
    cancelButtonType: 'info',
    confirmButtonType: 'primary',
    buttonSize: 'small',
    roundButton: true,
    center: true,
  })
}
</script>
