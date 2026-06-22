<template>
  <div class="popconfirm-demo">
    <moe-popconfirm
      title="使用 actions 插槽完全接管底部操作区。"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template #reference>
        <moe-button type="primary">自定义操作区</moe-button>
      </template>

      <template #actions="{ confirm, cancel }">
        <moe-button size="small" type="text" @click="cancel">稍后再说</moe-button>
        <moe-button size="small" type="danger" @click="confirm">立即执行</moe-button>
      </template>
    </moe-popconfirm>
    <span class="popconfirm-demo__status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref('等待操作')

function handleConfirm() {
  status.value = '已执行自定义确认'
}

function handleCancel() {
  status.value = '已取消自定义操作'
}
</script>

<style scoped>
.popconfirm-demo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.popconfirm-demo__status {
  color: var(--moe-text-color-secondary);
  font-size: var(--moe-font-size-small);
}
</style>
