import type { Component, ComputedRef, Ref } from 'vue'

import type { ComponentSize } from '@moe-ui/constants'

export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
export type NativeType = 'button' | 'submit' | 'reset'
export type ButtonSize = ComponentSize

export interface ButtonProps {
  tag?: string | Component
  type?: ButtonType
  size?: ButtonSize
  nativeType?: NativeType
  disabled?: boolean
  loading?: boolean
  icon?: string
  circle?: boolean
  plain?: boolean
  round?: boolean
  loadingIcon?: string
  autofocus?: boolean
  useThrottle?: boolean
  throttleDuration?: number
}

export interface ButtonGroupProps {
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
}

export interface ButtonEmits {
  (e: 'click', val: MouseEvent): void
}

export interface ButtonInstance {
  ref: Ref<HTMLElement | void>
  type?: ComputedRef<ButtonType | ''>
  size?: ComputedRef<ButtonSize | ''>
  disabled: ComputedRef<boolean>
}
