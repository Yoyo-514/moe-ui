<template>
  <div class="switch-demo-row">
    <moe-switch v-model="value1" :loading="loading1" :before-change="beforeChange1" />
    <moe-switch v-model="value2" :loading="loading2" :before-change="beforeChange2" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { MoeMessage } from '@moe-ui/components'

const value1 = ref(false)
const value2 = ref(false)
const loading1 = ref(false)
const loading2 = ref(false)

const beforeChange1 = () => {
  loading1.value = true
  return new Promise<boolean>((resolve) => {
    window.setTimeout(() => {
      loading1.value = false
      MoeMessage.success('切换成功')
      resolve(true)
    }, 1000)
  })
}

const beforeChange2 = () => {
  loading2.value = true
  return new Promise<boolean>((_, reject) => {
    window.setTimeout(() => {
      loading2.value = false
      MoeMessage.error('切换失败')
      reject(new Error('blocked'))
    }, 1000)
  })
}
</script>

<style scoped>
.switch-demo-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
