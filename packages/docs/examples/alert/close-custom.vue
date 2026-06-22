<template>
  <div class="alert-demo-list">
    <moe-alert title="默认关闭按钮" type="info" />
    <moe-alert title="自定义关闭文字" type="success" close-text="知道了" />
    <moe-alert title="不可关闭提示" type="warning" :closable="false" />
  </div>
</template>

<style scoped>
.alert-demo-list {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
}
</style>
