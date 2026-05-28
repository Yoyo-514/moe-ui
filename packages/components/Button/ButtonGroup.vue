<script lang="ts" setup>
import { computed, provide } from 'vue'
import { BUTTON_GROUP_CTX_KEY } from './constants'
import type { ButtonGroupProps } from './types'

defineOptions({
  name: 'MoeButtonGroup',
})

const props = defineProps<ButtonGroupProps>()

provide(BUTTON_GROUP_CTX_KEY, {
  type: computed(() => props.type),
  size: computed(() => props.size),
  disabled: computed(() => props.disabled),
})
</script>

<template>
  <div class="moe-button-group" role="group">
    <slot></slot>
  </div>
</template>
