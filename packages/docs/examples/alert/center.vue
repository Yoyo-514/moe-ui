<template>
  <div class="alert-demo-list">
    <moe-alert title="文字居中的提示内容" type="success" center />
    <moe-alert title="带图标且文字居中的提示内容" type="info" center show-icon />
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
