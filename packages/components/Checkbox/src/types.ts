import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { ComponentSize } from '@moe-ui/constants'

export type CheckboxValue = string | number | boolean
export type CheckboxModelValue = CheckboxValue | CheckboxValue[]
export type CheckboxSize = ComponentSize

export interface CheckboxProps {
  modelValue?: CheckboxModelValue
  label?: string | number
  value?: CheckboxValue
  trueValue?: CheckboxValue
  falseValue?: CheckboxValue
  disabled?: boolean
  size?: CheckboxSize
  name?: string
  id?: string
  indeterminate?: boolean
}

export interface CheckboxEmits {
  (e: 'update:modelValue', value: CheckboxModelValue): void
  (e: 'change', value: CheckboxModelValue): void
}

export interface CheckboxGroupProps {
  modelValue?: CheckboxValue[]
  disabled?: boolean
  size?: CheckboxSize
  min?: number
  max?: number
  name?: string
}

export interface CheckboxGroupEmits {
  (e: 'update:modelValue', value: CheckboxValue[]): void
  (e: 'change', value: CheckboxValue[]): void
}

export interface CheckboxGroupContext {
  modelValue: ComputedRef<CheckboxValue[]>
  disabled: ComputedRef<boolean>
  size: ComputedRef<CheckboxSize>
  name: ComputedRef<string | undefined>
  min: ComputedRef<number | undefined>
  max: ComputedRef<number | undefined>
  change: (value: CheckboxValue[]) => void
}

export const CHECKBOX_GROUP_CTX_KEY: InjectionKey<CheckboxGroupContext> = Symbol('checkboxGroup')

export interface CheckboxInstance {
  ref: Ref<HTMLInputElement | undefined>
  focus(): void
}
