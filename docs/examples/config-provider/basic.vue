<script setup lang="ts">
import { MoeButton, MoeConfigProvider } from '@moe-ui/components'
</script>

<template>
  <MoeConfigProvider size="small" :z-index="3000">
    <MoeButton type="primary">小尺寸按钮</MoeButton>
  </MoeConfigProvider>
</template>
