<template>
  <div class="input-demo">
    <moe-input v-model="url" placeholder="请输入网址">
      <template #prepend>https://</template>
      <template #append>.com</template>
    </moe-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const url = ref('moe-cute-ui')
</script>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
}
</style>
