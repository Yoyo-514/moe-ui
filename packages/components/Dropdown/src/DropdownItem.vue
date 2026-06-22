<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import { useDisabledStyle } from '@moe-ui/hooks'
import MoeIcon from '../../Icon/src/Icon.vue'
import { DROPDOWN_CTX_KEY } from './constants'
import type { DropdownItemProps } from './types'

defineOptions({
  name: 'MoeDropdownItem',
})

const props = withDefaults(defineProps<DropdownItemProps>(), {
  disabled: false,
  divided: false,
})

defineSlots<{
  default?: () => unknown
  icon?: () => unknown
}>()

const itemId = `moe-dropdown-item-${useId()}`
const dropdownContext = inject(DROPDOWN_CTX_KEY, undefined)
const { ariaDisabled, disabledClass, disabledTabIndex, isDisabled } = useDisabledStyle(
  () => props.disabled
)

const itemSizeClass = computed(() => {
  const size = dropdownContext?.size.value
  return size ? `moe-dropdown-item--${size}` : ''
})

const textCommand = computed(() => {
  if (typeof props.command === 'string' || typeof props.command === 'number') {
    return String(props.command)
  }

  return ''
})

function handleClick() {
  if (isDisabled.value) return

  dropdownContext?.handleItemClick(props)
}
</script>

<template>
  <li
    :id="itemId"
    class="moe-dropdown-item"
    :class="[
      itemSizeClass,
      disabledClass,
      {
        'is-divided': divided,
      },
    ]"
    role="menuitem"
    :aria-disabled="ariaDisabled"
    :tabindex="disabledTabIndex"
    @click="handleClick"
  >
    <span v-if="$slots.icon || icon" class="moe-dropdown-item__icon">
      <slot name="icon">
        <component :is="icon" v-if="typeof icon !== 'string'" />
        <moe-icon v-else :icon="icon" size="md" />
      </slot>
    </span>
    <span class="moe-dropdown-item__label">
      <slot>{{ textCommand }}</slot>
    </span>
  </li>
</template>
