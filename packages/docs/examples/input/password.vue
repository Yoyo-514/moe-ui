<template>
  <moe-input v-model="password" type="password" show-password placeholder="请输入密码" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const password = ref('')
</script>
