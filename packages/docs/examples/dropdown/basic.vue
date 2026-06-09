<template>
  <div class="dropdown-demo">
    <moe-dropdown trigger="click" @command="handleCommand">
      <moe-button type="primary">更多操作</moe-button>

      <template #dropdown>
        <moe-dropdown-menu>
          <moe-dropdown-item command="profile" icon="mingcute:user-line">
            个人中心
          </moe-dropdown-item>
          <moe-dropdown-item command="setting" icon="mingcute:settings-3-line">
            偏好设置
          </moe-dropdown-item>
          <moe-dropdown-item command="logout" icon="mingcute:exit-line" divided>
            退出登录
          </moe-dropdown-item>
        </moe-dropdown-menu>
      </template>
    </moe-dropdown>

    <span class="dropdown-demo__status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref('等待选择')

function handleCommand(command: string | number | object) {
  status.value = `选择了：${String(command)}`
}
</script>

<style scoped>
.dropdown-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dropdown-demo__status {
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
}
</style>
