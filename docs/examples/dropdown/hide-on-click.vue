<template>
  <div class="dropdown-hide-demo">
    <moe-dropdown trigger="click" :hide-on-click="false" @command="handleCommand">
      <moe-button>点击菜单后不关闭</moe-button>

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item command="bold">加粗</moe-dropdown-item>
          <moe-dropdown-item command="italic">斜体</moe-dropdown-item>
          <moe-dropdown-item command="underline">下划线</moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <moe-dropdown trigger="click" @command="handleCommand">
      <moe-button type="primary">点击菜单后关闭</moe-button>

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item command="save">保存</moe-dropdown-item>
          <moe-dropdown-item command="publish">发布</moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <span class="dropdown-hide-demo__status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref('hideOnClick 可控制点击菜单项后是否关闭')

function handleCommand(command: string | number | object) {
  status.value = `点击：${String(command)}`
}
</script>

<style scoped>
.dropdown-hide-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dropdown-hide-demo__status {
  width: 100%;
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
}
</style>
