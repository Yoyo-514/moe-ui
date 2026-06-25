<template>
  <div class="radio-demo-row">
    <moe-radio v-model="value" value="sakura" border>樱粉</moe-radio>
    <moe-radio v-model="value" value="sky" border>晴空</moe-radio>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('sakura')
</script>

<style scoped>
.radio-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
