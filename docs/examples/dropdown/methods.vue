<template>
  <div class="dropdown-methods-demo">
    <moe-dropdown ref="dropdownRef" trigger="click" @command="handleCommand">
      <moe-button type="primary">方法控制菜单</moe-button>

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item command="refresh">刷新</moe-dropdown-item>
          <moe-dropdown-item command="export">导出</moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <moe-button @click="dropdownRef?.open()">打开</moe-button>
    <moe-button @click="dropdownRef?.close()">关闭</moe-button>

    <span class="dropdown-methods-demo__status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { DropdownInstance } from '@moe-ui/components'

const dropdownRef = ref<DropdownInstance>()
const status = ref('可以通过 open / close 控制下拉菜单')

function handleCommand(command: string | number | object) {
  status.value = `命令：${String(command)}`
}
</script>

<style scoped>
.dropdown-methods-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dropdown-methods-demo__status {
  width: 100%;
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
}
</style>
