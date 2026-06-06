<template>
  <div class="tooltip-effect-demo">
    <moe-tooltip content="深色主题" effect="dark">
      <moe-button>Dark</moe-button>
    </moe-tooltip>
    <moe-tooltip content="浅色主题" effect="light">
      <moe-button>Light</moe-button>
    </moe-tooltip>
  </div>
</template>

<style scoped>
.tooltip-effect-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
