import type { Component, Ref } from 'vue'

export const inputSizes = ['small', 'default', 'large'] as const
export const inputResizeTypes = ['none', 'both', 'horizontal', 'vertical'] as const

export type InputSize = (typeof inputSizes)[number]
export type InputResize = (typeof inputResizeTypes)[number]
export type InputElement = HTMLInputElement | HTMLTextAreaElement

export interface InputAutoSize {
  minRows?: number
  maxRows?: number
}

export interface InputProps {
  modelValue?: string | number | null
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  showPassword?: boolean
  showWordLimit?: boolean
  maxlength?: number | string
  minlength?: number | string
  autocomplete?: string
  name?: string
  id?: string
  form?: string
  size?: InputSize
  prefixIcon?: string | Component
  suffixIcon?: string | Component
  autofocus?: boolean
  tabindex?: string | number
  rows?: number | string
  resize?: InputResize
  autosize?: boolean | InputAutoSize
}

export interface InputEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', value: string): void
  (e: 'change', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
}

export interface InputInstance {
  inputRef: Ref<InputElement | undefined>
  focus(): Promise<void>
  blur(): void
  select(): void
  clear(): void
}
