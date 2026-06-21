<template>
  <moe-button @click="open">使用 VNode</moe-button>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { MoeMessageBox } from '@moe-ui/components'

const open = () => {
  MoeMessageBox.alert(
    () =>
      h('p', { class: 'message-box-vnode' }, [
        '这是一段 ',
        h('strong', { style: { color: 'var(--moe-color-primary)' } }, 'VNode'),
        ' 内容。',
      ]),
    'VNode 内容'
  )
}
</script>
