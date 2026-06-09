<template>
  <div class="dropdown-trigger-demo">
    <moe-dropdown @command="handleCommand">
      <moe-button>Hover 触发</moe-button>

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item command="preview">预览</moe-dropdown-item>
          <moe-dropdown-item command="copy">复制链接</moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <moe-dropdown trigger="click" @command="handleCommand">
      <moe-button type="primary">Click 触发</moe-button>

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item command="star">收藏</moe-dropdown-item>
          <moe-dropdown-item command="share">分享</moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <span class="dropdown-trigger-demo__status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref('试试 hover 或 click')

function handleCommand(command: string | number | object) {
  status.value = `触发命令：${String(command)}`
}
</script>

<style scoped>
.dropdown-trigger-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dropdown-trigger-demo__status {
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
}
</style>
