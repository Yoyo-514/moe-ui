import type { ComputedRef, Ref } from 'vue'

import type { ComponentSize } from '@moe-ui/constants'

export type SelectPrimitiveValue = string | number | boolean
export type SelectObjectValue = Record<string, unknown>
export type SelectValue = SelectPrimitiveValue | SelectObjectValue
export type SelectModelValue = SelectValue | undefined | null
export type SelectSize = ComponentSize

export interface SelectOption {
  value?: SelectValue
  label?: string | number
  disabled?: boolean
  [key: string]: unknown
}

export interface SelectPropsConfig {
  value?: string
  label?: string
  disabled?: string
}

export interface SelectProps {
  modelValue?: SelectModelValue
  options?: SelectOption[]
  props?: SelectPropsConfig
  disabled?: boolean
  size?: SelectSize
  clearable?: boolean
  filterable?: boolean
  filterMethod?: (query: string, option: SelectOption) => boolean
  loading?: boolean
  loadingText?: string
  noMatchText?: string
  noDataText?: string
  placeholder?: string
  name?: string
  valueKey?: string
  emptyValues?: SelectModelValue[]
  valueOnClear?: SelectModelValue
}

export interface OptionProps {
  value: SelectValue
  label?: string | number
  disabled?: boolean
}

export interface NormalizedSelectOption {
  value: SelectModelValue
  label: string
  disabled: boolean
  raw: SelectOption
}

export interface SelectEmits {
  (e: 'update:modelValue', value: SelectModelValue): void
  (e: 'change', value: SelectModelValue): void
  (e: 'visible-change', visible: boolean): void
  (e: 'clear'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

export interface SelectInstance {
  ref: Ref<HTMLElement | undefined>
  focus(): void
  blur(): void
  selectedLabel: ComputedRef<string>
}

export interface SelectContext {
  registerOption(option: NormalizedSelectOption): void
  unregisterOption(value: SelectModelValue): void
}
