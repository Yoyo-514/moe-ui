<template>
  <moe-input
    v-model="value"
    type="textarea"
    :rows="4"
    resize="vertical"
    placeholder="请输入多行文本"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>
