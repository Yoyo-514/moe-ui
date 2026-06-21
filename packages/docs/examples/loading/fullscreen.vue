<template>
  <div>
    <moe-button @click="openFullscreen">全屏加载 2 秒</moe-button>
    <div v-loading.fullscreen.lock="loading" moe-loading-text="全屏加载中"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)

const openFullscreen = () => {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>
