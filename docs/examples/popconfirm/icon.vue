<template>
  <div class="popconfirm-row">
    <moe-popconfirm
      title="当前操作风险较高，确认继续吗？"
      icon="mingcute:warning-line"
      icon-color="#f59e0b"
    >
      <template #reference>
        <moe-button type="warning">自定义图标</moe-button>
      </template>
    </moe-popconfirm>

    <moe-popconfirm title="不展示图标，只保留确认内容。" hide-icon>
      <template #reference>
        <moe-button>隐藏图标</moe-button>
      </template>
    </moe-popconfirm>
  </div>
</template>

<style scoped>
.popconfirm-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
