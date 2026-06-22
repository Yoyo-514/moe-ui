<template>
  <moe-button @click="open">带事件的 VNode</moe-button>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { MoeMessage, MoeMessageBox } from '@moe-ui/components'

const open = () => {
  MoeMessageBox.alert(
    () =>
      h('div', { class: 'message-box-event-vnode' }, [
        h('span', 'VNode 中可以绑定事件：'),
        h(
          'button',
          {
            type: 'button',
            class: 'message-box-link-button',
            onClick: () => MoeMessage.success('点击了 VNode 按钮'),
          },
          '点我'
        ),
      ]),
    '事件处理'
  )
}
</script>

<style scoped>
.message-box-event-vnode {
  display: flex;
  align-items: center;
  gap: 8px;
}
.message-box-link-button {
  padding: 0;
  border: none;
  color: var(--moe-color-primary);
  background: transparent;
  cursor: pointer;
}
</style>
