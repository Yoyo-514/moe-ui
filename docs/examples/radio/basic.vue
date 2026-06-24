<template>
  <div class="radio-demo-column">
    <moe-radio v-model="value" value="sakura">樱粉</moe-radio>
    <moe-radio v-model="value" value="sky">晴空</moe-radio>
    <span>当前值：{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('sakura')
</script>

<style scoped>
.radio-demo-column {
  display: grid;
  gap: 12px;
}
</style>
