<template>
  <div class="dropdown-size-demo">
    <moe-dropdown
      v-for="item in sizes"
      :key="item.label"
      trigger="click"
      :size="item.size"
      split-button
      type="primary"
      @command="handleCommand"
    >
      {{ item.label }}

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item command="create">创建</moe-dropdown-item>
          <moe-dropdown-item command="import">导入</moe-dropdown-item>
          <moe-dropdown-item command="delete" divided>删除</moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <span class="dropdown-size-demo__status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const sizes = [
  { label: '默认尺寸', size: undefined },
  { label: '大尺寸', size: 'large' },
  { label: '小尺寸', size: 'small' },
] as const

const status = ref('size 会影响 split-button 和菜单项尺寸')

function handleCommand(command: string | number | object) {
  status.value = `命令：${String(command)}`
}
</script>

<style scoped>
.dropdown-size-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dropdown-size-demo__status {
  width: 100%;
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
}
</style>
