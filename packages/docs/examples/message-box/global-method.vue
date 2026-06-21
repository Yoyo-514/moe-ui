<template>
  <div class="message-box-demo">
    <moe-button @click="openAlert">$alert</moe-button>
    <moe-button @click="openConfirm">$confirm</moe-button>
    <moe-button @click="openPrompt">$prompt</moe-button>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const global = instance?.appContext.config.globalProperties

const openAlert = () => {
  global?.$alert?.('通过全局方法调用 Alert。', '全局方法')
}

const openConfirm = () => {
  global?.$confirm?.('通过全局方法调用 Confirm。', '全局方法')
}

const openPrompt = () => {
  global?.$prompt?.('通过全局方法调用 Prompt。', '全局方法')
}
</script>

<style scoped>
.message-box-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
