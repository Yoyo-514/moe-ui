<template>
  <moe-select v-model="value" :options="options" placeholder="Select" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'Option1', label: 'Option1' },
  { value: 'Option2', label: 'Option2', disabled: true },
  { value: 'Option3', label: 'Option3' },
  { value: 'Option4', label: 'Option4' },
]
</script>
