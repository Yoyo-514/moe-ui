<template>
  <div class="input-demo">
    <moe-input v-model="value" type="textarea" autosize placeholder="自适应高度文本域" />
    <moe-input
      v-model="limitedValue"
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4 }"
      placeholder="限制最小和最大行数"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const limitedValue = ref('')
</script>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
}
</style>
