<template>
  <moe-select
    v-model="value"
    :options="cities"
    :props="{ value: 'id', label: 'name', disabled: 'locked' }"
    placeholder="Select"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(1)
const cities = [
  { id: 1, name: 'Beijing' },
  { id: 2, name: 'Shanghai', locked: true },
  { id: 3, name: 'Shenzhen' },
]
</script>
