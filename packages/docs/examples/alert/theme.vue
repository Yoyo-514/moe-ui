<template>
  <div class="alert-demo-list">
    <moe-alert title="成功提示" type="success" />
    <moe-alert title="消息提示" type="info" />
    <moe-alert title="警告提示" type="warning" />
    <moe-alert title="错误提示" type="danger" />
    <moe-alert title="深色主题提示" type="success" effect="dark" />
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
