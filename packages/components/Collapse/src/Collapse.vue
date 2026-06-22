<script setup lang="ts">
import { computed, provide } from 'vue'
import { debugWarnOnce } from '@moe-ui/utils'
import { includes, isArray, isNil, isNumber, isString, without } from 'lodash-es'
import { COLLAPSE_CTX_KEY } from './constants'
import type { CollapseEmits, CollapseItemName, CollapseModelValue, CollapseProps } from './types'

defineOptions({ name: 'MoeCollapse' })

const props = withDefaults(defineProps<CollapseProps>(), {
  accordion: false,
})

const emit = defineEmits<CollapseEmits>()

function isValidCollapseItemName(value: unknown): value is CollapseItemName {
  return isString(value) || isNumber(value)
}

function normalizeActiveNames(value: unknown): CollapseItemName[] {
  if (isNil(value) || value === '') return []

  const activeNames = isArray(value) ? value : [value]
  const validActiveNames = activeNames.filter(isValidCollapseItemName)

  if (validActiveNames.length !== activeNames.length) {
    debugWarnOnce(
      'MoeCollapse',
      'modelValue should be a string, number, or an array of string/number.'
    )
  }

  return validActiveNames
}

const activeNames = computed(() => normalizeActiveNames(props.modelValue))

function handleItemClick(name: CollapseItemName) {
  const currentActiveNames = activeNames.value
  const isActive = includes(currentActiveNames, name)
  let nextValue: CollapseModelValue

  if (props.accordion) {
    nextValue = isActive ? '' : name
  } else {
    nextValue = isActive ? without(currentActiveNames, name) : [...currentActiveNames, name]
  }

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

provide(COLLAPSE_CTX_KEY, {
  activeNames,
  handleItemClick,
})
</script>

<template>
  <div class="moe-collapse" role="tablist" :class="{ 'is-accordion': accordion }">
    <slot></slot>
  </div>
</template>
