<template>
  <div class="notification-demo">
    <moe-button type="primary" @click="openNotification">this.$notification</moe-button>
    <moe-button type="success" @click="openSuccessNotification">
      this.$notification.success
    </moe-button>
    <moe-button type="danger" plain @click="closeAllNotifications">
      this.$notification.closeAll
    </moe-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    openNotification() {
      this.$notification({
        title: '全局方法',
        message: '通过 app.config.globalProperties.$notification 调用',
      })
    },
    openSuccessNotification() {
      this.$notification.success({
        title: '成功',
        message: '在组件实例中调用 this.$notification.success',
      })
    },
    closeAllNotifications() {
      this.$notification.closeAll()
    },
  },
})
</script>

<style scoped>
.notification-demo {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
