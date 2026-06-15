<template>
  <div class="input-demo">
    <moe-input v-model="value" disabled placeholder="禁用状态" />
    <moe-input v-model="value" readonly placeholder="只读状态" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('Moe Cute UI')
</script>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
}
</style>
