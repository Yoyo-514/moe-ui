<template>
  <moe-popconfirm
    title="确认发布当前版本吗？"
    confirm-button-text="发布"
    cancel-button-text="再想想"
    confirm-button-type="success"
    cancel-button-type="info"
  >
    <template #reference>
      <moe-button type="primary">发布版本</moe-button>
    </template>
  </moe-popconfirm>
</template>
