<template>
  <div class="switch-demo-row">
    <moe-switch v-model="value1" />
    <moe-switch
      v-model="value2"
      style="--moe-switch-on-color: #13ce66; --moe-switch-off-color: #ff4949"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(false)
</script>

<style scoped>
.switch-demo-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
