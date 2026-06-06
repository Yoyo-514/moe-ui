<template>
  <moe-tooltip>
    <moe-button type="primary">自定义内容</moe-button>
    <template #content>
      <div class="tooltip-rich-content">
        <strong>自定义 Tooltip</strong>
        <span>可以放置更灵活的提示内容。</span>
      </div>
    </template>
  </moe-tooltip>
</template>

<style scoped>
.tooltip-rich-content {
  display: grid;
  gap: 4px;
}
</style>
