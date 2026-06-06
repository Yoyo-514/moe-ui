<template>
  <div class="tooltip-trigger-demo">
    <moe-tooltip content="悬停触发" trigger="hover">
      <moe-button>Hover</moe-button>
    </moe-tooltip>
    <moe-tooltip content="点击触发" trigger="click">
      <moe-button>Click</moe-button>
    </moe-tooltip>
  </div>
</template>

<style scoped>
.tooltip-trigger-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
