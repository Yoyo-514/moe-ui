<template>
  <div class="input-demo">
    <moe-input v-model="inputValue" clearable placeholder="聚焦或悬停后可清空" />
    <moe-input v-model="textareaValue" type="textarea" clearable placeholder="文本域也支持清空" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('可以清空的输入框')
const textareaValue = ref('可以清空的文本域')
</script>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
}
</style>
