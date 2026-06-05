<template>
  <div class="alert-demo-list">
    <moe-alert title="成功提示" type="success" show-icon />
    <moe-alert title="消息提示" type="info" show-icon />
    <moe-alert title="警告提示" type="warning" show-icon />
    <moe-alert title="错误提示" type="danger" show-icon />
    <moe-alert title="自定义图标提示" type="success">
      <template #icon>
        <moe-icon icon="mingcute:sparkles-line" />
      </template>
    </moe-alert>
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
