<template>
  <div class="dropdown-command-demo">
    <moe-dropdown trigger="click" @command="handleCommand">
      <moe-button type="warning">选择业务动作</moe-button>

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item command="copy" icon="mingcute:copy-2-line">复制链接</moe-dropdown-item>
          <moe-dropdown-item :command="1001" icon="mingcute:hashtag-line">
            选择编号 1001
          </moe-dropdown-item>
          <moe-dropdown-item
            :command="{ action: 'archive', id: 1001 }"
            icon="mingcute:archive-line"
            divided
          >
            归档项目 #1001
          </moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <span class="dropdown-command-demo__status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref('command 支持 string、number 和 object')

function handleCommand(command: string | number | object) {
  status.value = typeof command === 'object' ? JSON.stringify(command) : String(command)
}
</script>

<style scoped>
.dropdown-command-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dropdown-command-demo__status {
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
}
</style>
