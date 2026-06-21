<template>
  <moe-select v-model="value" :options="options" filterable placeholder="Select" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'Beijing', label: 'Beijing' },
  { value: 'Shanghai', label: 'Shanghai' },
  { value: 'Nanjing', label: 'Nanjing' },
  { value: 'Chengdu', label: 'Chengdu' },
  { value: 'Shenzhen', label: 'Shenzhen' },
  { value: 'Guangzhou', label: 'Guangzhou' },
]
</script>
