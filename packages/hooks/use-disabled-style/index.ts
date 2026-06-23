import { computed, unref } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

import { isBoolean, isFunction } from 'lodash-es'

export type DisabledStyleValue = MaybeRefOrGetter<boolean | undefined>

const resolveDisabled = (disabled: DisabledStyleValue) =>
  isFunction(disabled) ? disabled() : unref(disabled)

export function useDisabledStyle(disabled: DisabledStyleValue) {
  const isDisabled = computed(() => {
    const value = resolveDisabled(disabled)
    return isBoolean(value) ? value : Boolean(value)
  })

  const disabledClass = computed(() => ({
    'is-disabled': isDisabled.value,
  }))

  const ariaDisabled = computed(() => (isDisabled.value ? 'true' : 'false'))
  const disabledTabIndex = computed(() => (isDisabled.value ? -1 : 0))

  return {
    isDisabled,
    disabledClass,
    ariaDisabled,
    disabledTabIndex,
  }
}
