<template>
  <div
    v-loading="loading"
    class="loading-demo__box"
    moe-loading-text="拼命加载中"
    moe-loading-spinner="mingcute:refresh-3-line"
    moe-loading-background="rgba(255, 255, 255, 0.82)"
    moe-loading-custom-class="custom-loading-mask"
  >
    <p>可以通过属性自定义加载文案、图标、背景和 class。</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
</script>

<style scoped>
.loading-demo__box {
  min-height: 140px;
  padding: 16px;
  border: 1px solid var(--moe-border-color);
  border-radius: var(--moe-border-radius-base);
}
</style>
