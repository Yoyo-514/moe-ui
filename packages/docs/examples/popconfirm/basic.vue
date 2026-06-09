<template>
  <div class="popconfirm-demo">
    <moe-popconfirm title="确定删除这条记录吗？" @confirm="handleConfirm" @cancel="handleCancel">
      <template #reference>
        <moe-button type="danger">删除</moe-button>
      </template>
    </moe-popconfirm>
    <span class="popconfirm-demo__status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref('等待操作')

function handleConfirm() {
  status.value = '已确认删除'
}

function handleCancel() {
  status.value = '已取消'
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
