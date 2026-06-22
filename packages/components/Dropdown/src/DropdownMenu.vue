<script setup lang="ts">
defineOptions({
  name: 'MoeDropdownMenu',
})

defineSlots<{
  default?: () => unknown
}>()
</script>

<template>
  <ul class="moe-dropdown-menu" role="menu">
    <slot></slot>
  </ul>
</template>
