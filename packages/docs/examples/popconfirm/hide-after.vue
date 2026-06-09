<template>
  <moe-popconfirm
    title="点击确认后会延迟 1 秒关闭。"
    :hide-after="1000"
    confirm-button-text="确认关闭"
  >
    <template #reference>
      <moe-button type="primary">延迟关闭</moe-button>
    </template>
  </moe-popconfirm>
</template>
