<template>
  <moe-button @click="open">按需引入</moe-button>
</template>

<script setup lang="ts">
import { MoeMessageBox } from '@moe-ui/components'

const open = () => {
  MoeMessageBox.alert('可以从 @moe-ui/components 或 moe-cute-ui 按需引入。', '按需引入')
}
</script>
