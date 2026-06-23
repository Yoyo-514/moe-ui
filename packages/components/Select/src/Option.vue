<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, watch } from 'vue'

import { SELECT_CTX_KEY } from './constants'

import type { NormalizedSelectOption, OptionProps } from './types'

defineOptions({
  name: 'MoeOption',
})

const props = withDefaults(defineProps<OptionProps>(), {
  label: '',
  disabled: false,
})
const selectContext = inject(SELECT_CTX_KEY, undefined)

const normalizedOption = computed<NormalizedSelectOption>(() => {
  const label = props.label ?? String(props.value)

  return {
    value: props.value,
    label: String(label),
    disabled: props.disabled,
    raw: {
      value: props.value,
      label,
      disabled: props.disabled,
    },
  }
})

onMounted(() => {
  selectContext?.registerOption(normalizedOption.value)
})

watch(normalizedOption, (option) => {
  selectContext?.registerOption(option)
})

onBeforeUnmount(() => {
  selectContext?.unregisterOption(props.value)
})
</script>

<template>
  <slot></slot>
</template>
