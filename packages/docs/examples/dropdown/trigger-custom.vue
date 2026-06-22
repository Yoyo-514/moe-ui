<template>
  <div class="dropdown-target-demo">
    <moe-dropdown trigger="click" @command="handleCommand">
      <moe-button type="primary">普通触发对象</moe-button>

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item command="normal-edit">编辑</moe-dropdown-item>
          <moe-dropdown-item command="normal-share">分享</moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <moe-dropdown
      split-button
      type="success"
      trigger="click"
      @click="handleMainClick"
      @command="handleCommand"
    >
      分裂按钮

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item command="split-template">从模板创建</moe-dropdown-item>
          <moe-dropdown-item command="split-import">导入项目</moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <span class="dropdown-target-demo__tip">
      split-button 模式下，下拉菜单以右侧箭头按钮作为定位参考。
    </span>
    <span class="dropdown-target-demo__status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref('点击普通按钮或分裂按钮右侧箭头')

function handleMainClick() {
  status.value = '点击了分裂按钮的主按钮'
}

function handleCommand(command: string | number | object) {
  status.value = `命令：${String(command)}`
}
</script>

<style scoped>
.dropdown-target-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dropdown-target-demo__tip,
.dropdown-target-demo__status {
  width: 100%;
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
}
</style>
