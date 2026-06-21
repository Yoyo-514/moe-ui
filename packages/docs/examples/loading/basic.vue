<template>
  <div class="loading-demo">
    <moe-button @click="loading = !loading">
      {{ loading ? '关闭加载' : '打开加载' }}
    </moe-button>
    <div v-loading="loading" class="loading-demo__box">
      <p>这里是一块需要加载的数据区域。</p>
      <p>Loading 会覆盖当前容器。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
</script>

<style scoped>
.loading-demo {
  display: grid;
  gap: 12px;
}
.loading-demo__box {
  min-height: 140px;
  padding: 16px;
  border: 1px solid var(--moe-border-color);
  border-radius: var(--moe-border-radius-base);
}
</style>
