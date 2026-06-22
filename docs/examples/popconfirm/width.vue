<template>
  <div class="popconfirm-row">
    <moe-popconfirm title="宽度为 120px，组件不会额外设置最小宽度限制。" :width="120">
      <template #reference>
        <moe-button>120px</moe-button>
      </template>
    </moe-popconfirm>

    <moe-popconfirm title="宽度可以传入字符串，例如 260px。" width="260px">
      <template #reference>
        <moe-button>260px</moe-button>
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
