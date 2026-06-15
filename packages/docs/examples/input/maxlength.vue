<template>
  <div class="input-demo">
    <moe-input
      v-model="inputValue"
      :maxlength="20"
      show-word-limit
      placeholder="最多输入 20 个字符"
    />
    <moe-input
      v-model="textareaValue"
      type="textarea"
      :maxlength="50"
      show-word-limit
      placeholder="文本域字数限制"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('')
const textareaValue = ref('')
</script>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
}
</style>
