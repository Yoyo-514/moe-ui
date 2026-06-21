<template>
  <moe-button @click="openService">服务方式调用</moe-button>
</template>

<script setup lang="ts">
import { MoeLoading } from '@moe-ui/components'

const openService = () => {
  const instance = MoeLoading.service({
    text: '服务加载中',
    spinner: 'mingcute:loading-line',
    lock: true,
  })

  window.setTimeout(() => {
    instance.close()
  }, 2000)
}
</script>
