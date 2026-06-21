<template>
  <moe-select v-model="value" :options="options" disabled placeholder="Select" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('Option1')
const options = [
  { value: 'Option1', label: 'Option1' },
  { value: 'Option2', label: 'Option2' },
]
</script>
