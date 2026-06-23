import type { Component, Ref } from 'vue'

import type { ComponentSize } from '@moe-ui/constants'

export type SwitchValue = boolean | string | number
export type SwitchSize = ComponentSize
export type SwitchIcon = string | Component

export interface SwitchProps {
  modelValue?: SwitchValue
  disabled?: boolean
  loading?: boolean
  size?: SwitchSize
  width?: string | number
  inlinePrompt?: boolean
  activeIcon?: SwitchIcon
  inactiveIcon?: SwitchIcon
  activeText?: string
  inactiveText?: string
  activeValue?: SwitchValue
  inactiveValue?: SwitchValue
  name?: string
  beforeChange?: () => boolean | Promise<boolean>
}

export interface SwitchEmits {
  (e: 'update:modelValue', value: SwitchValue): void
  (e: 'change', value: SwitchValue): void
}

export interface SwitchInstance {
  ref: Ref<HTMLButtonElement | undefined>
  focus(): void
}
