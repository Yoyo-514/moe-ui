<template>
  <div class="radio-demo-column">
    <moe-radio-group v-model="value" disabled>
      <moe-radio value="sakura">樱粉</moe-radio>
      <moe-radio value="sky">晴空</moe-radio>
    </moe-radio-group>
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
