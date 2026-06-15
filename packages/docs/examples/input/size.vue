<template>
  <div class="input-demo">
    <moe-input v-model="value" size="large" placeholder="large" />
    <moe-input v-model="value" placeholder="default" />
    <moe-input v-model="value" size="small" placeholder="small" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
}
</style>
