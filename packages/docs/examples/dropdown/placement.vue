<template>
  <div class="dropdown-placement-demo">
    <moe-dropdown
      v-for="placement in placements"
      :key="placement"
      trigger="click"
      :placement="placement"
      @command="handleCommand"
    >
      <moe-button>{{ placement }}</moe-button>

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item :command="`${placement}-copy`">复制</moe-dropdown-item>
          <moe-dropdown-item :command="`${placement}-share`">分享</moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <span class="dropdown-placement-demo__status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const placements = ['bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end'] as const
const status = ref('点击按钮查看不同位置')

function handleCommand(command: string | number | object) {
  status.value = `命令：${String(command)}`
}
</script>

<style scoped>
.dropdown-placement-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dropdown-placement-demo__status {
  width: 100%;
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
}
</style>
