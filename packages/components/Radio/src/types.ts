import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { ComponentSize } from '@moe-ui/constants'

export type RadioValue = string | number | boolean
export type RadioSize = ComponentSize

export interface RadioProps {
  modelValue?: RadioValue
  label?: string | number
  value?: RadioValue
  disabled?: boolean
  size?: RadioSize
  name?: string
  id?: string
}

export interface RadioEmits {
  (e: 'update:modelValue', value: RadioValue): void
  (e: 'change', value: RadioValue): void
}

export interface RadioGroupProps {
  modelValue?: RadioValue
  disabled?: boolean
  size?: RadioSize
  name?: string
}

export interface RadioGroupEmits {
  (e: 'update:modelValue', value: RadioValue): void
  (e: 'change', value: RadioValue): void
}

export interface RadioGroupContext {
  modelValue: ComputedRef<RadioValue | undefined>
  disabled: ComputedRef<boolean>
  size: ComputedRef<RadioSize>
  name: ComputedRef<string | undefined>
  change: (value: RadioValue) => void
}

export const RADIO_GROUP_CTX_KEY: InjectionKey<RadioGroupContext> = Symbol('radioGroup')

export interface RadioInstance {
  ref: Ref<HTMLInputElement | undefined>
  focus(): void
}
