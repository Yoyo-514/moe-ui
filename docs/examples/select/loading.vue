<template>
  <moe-select v-model="value" loading loading-text="加载中" placeholder="Select" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>
