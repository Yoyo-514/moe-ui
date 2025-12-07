<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps } from './types'

defineOptions({
  name: 'MoeButton',
})

const props = withDefaults(defineProps<ButtonProps>(), {
  tag: 'button',
  nativeType: 'button',
})

const _slots = defineSlots()

const _ref = ref<HTMLButtonElement>()

defineExpose({
  ref: _ref,
})
</script>

<template>
  <component
    :is="props.tag"
    ref="_ref"
    class="moe-button"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : void 0"
    :class="{
      [`moe-button--${type}`]: type,
      [`moe-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
  >
    <slot></slot>
  </component>
</template>
