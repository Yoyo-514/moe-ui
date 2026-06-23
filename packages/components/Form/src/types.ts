import type { ComputedRef } from 'vue'

import type { Arrayable } from '@moe-ui/utils'

import type { ComponentSize } from '@moe-ui/constants'

import type { RuleItem, ValidateError, Values } from 'async-validator'

export type FormSize = ComponentSize
export type FormLabelPosition = 'left' | 'right' | 'top'
export type FormItemLabelPosition = FormLabelPosition | ''
export type FormRequireAsteriskPosition = 'left' | 'right'
export type FormItemValidateState = '' | 'success' | 'error' | 'validating'
export type FormValidateState = FormItemValidateState

/**
 * Form validation trigger follows Element Plus semantics.
 *
 * `trigger` describes which UI interaction should run a rule:
 * - `blur`: validate when the control loses focus
 * - `change`: validate when the bound value changes
 *
 * It is intentionally not a generic string. Keeping it narrow makes rule
 * filtering predictable and prevents silent typos such as `chnage`.
 */
export type FormValidateTrigger = 'blur' | 'change'

/**
 * A form item prop can be a dot path (`user.name`) or path segments
 * (`['user', 'name']`). The array form is useful for model keys containing dots.
 */
export type FormItemProp = Arrayable<string>

export type FormValidateCallback = (
  isValid: boolean,
  invalidFields?: ValidateFieldsError
) => void | Promise<void>
export type FormValidationResult = Promise<boolean>
export type FormValidateFailure = {
  errors?: ValidateError[]
  fields: ValidateFieldsError
}
export type ValidateFieldsError = Record<string, ValidateError[]>

/**
 * Type-level helper used to build dot paths from a model object.
 *
 * This is intentionally shallow-friendly rather than fully strict:
 * - object keys are expanded as `user.name`
 * - arrays fall back to their key to avoid expensive tuple recursion
 * - non-object values resolve to their direct key
 *
 * The goal is to provide editor hints for common form models without making
 * every consumer pay for overly complex recursive types.
 */
type FormPathImpl<Key extends string, Value> = Value extends readonly unknown[]
  ? Key
  : Value extends Record<string, unknown>
    ? Key | `${Key}.${FormPath<Value>}`
    : Key

/** Dot-path union for form model fields. Falls back to `string` for loose records. */
export type FormPath<T> =
  T extends Record<string, unknown>
    ? {
        [Key in Extract<keyof T, string>]: FormPathImpl<Key, T[Key]>
      }[Extract<keyof T, string>]
    : string

/**
 * async-validator does not define `trigger` because it is UI-framework specific.
 * Moe UI extends RuleItem with Element Plus-like blur/change triggers while
 * keeping all async-validator fields such as `required`, `message`, `validator`
 * and `asyncValidator` available.
 */
export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<FormValidateTrigger>
}

/**
 * Rules are keyed by model paths. Values accept a single rule or a rule array,
 * matching async-validator while preserving typed path hints for common models.
 */
export type FormRules<T extends Record<string, unknown> = Record<string, unknown>> = Partial<
  Record<FormPath<T>, Arrayable<FormItemRule>>
>

export interface FormProps<T extends Record<string, unknown> = Record<string, unknown>> {
  model: T
  rules?: FormRules<T>
  inline?: boolean
  labelPosition?: FormLabelPosition
  labelWidth?: string | number
  labelSuffix?: string
  hideRequiredAsterisk?: boolean
  requireAsteriskPosition?: FormRequireAsteriskPosition
  showMessage?: boolean
  inlineMessage?: boolean
  size?: FormSize
  disabled?: boolean
  scrollToError?: boolean
}

export interface FormEmits {
  validate: [prop: FormItemProp, isValid: boolean, message: string]
}

export interface FormSlots {
  default?: () => unknown
}

export interface FormItemProps {
  prop?: FormItemProp
  label?: string
  labelPosition?: FormItemLabelPosition
  labelWidth?: string | number
  required?: boolean
  rules?: Arrayable<FormItemRule>
  error?: string
  showMessage?: boolean
  inlineMessage?: boolean
  size?: FormSize
  for?: string
  validateStatus?: FormItemValidateState
}

export interface FormItemSlots {
  default?: () => unknown
  label?: (scope: { label: string }) => unknown
  error?: (scope: { error: string }) => unknown
}

export interface FormItemValidateOptions {
  trigger?: FormValidateTrigger
}

export interface FormItemContext {
  prop?: FormItemProp
  propString: string
  validateState: ComputedRef<FormItemValidateState>
  validateMessage: ComputedRef<string>
  validate: (trigger?: FormValidateTrigger, callback?: FormValidateCallback) => FormValidationResult
  resetField: () => void
  clearValidate: () => void
  scrollToField: () => void
}

export interface FormContext {
  props: FormProps
  model: ComputedRef<Values>
  fields: FormItemContext[]
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
  emitValidate: (prop: FormItemProp, isValid: boolean, message: string) => void
}

export interface FormInstance {
  validate: (callback?: FormValidateCallback) => FormValidationResult
  validateField: (
    props?: Arrayable<FormItemProp>,
    callback?: FormValidateCallback
  ) => FormValidationResult
  resetFields: (props?: Arrayable<FormItemProp>) => void
  scrollToField: (prop: FormItemProp) => void
  clearValidate: (props?: Arrayable<FormItemProp>) => void
}

export interface FormItemInstance {
  size: ComputedRef<FormSize | undefined>
  validateMessage: ComputedRef<string>
  validateState: ComputedRef<FormItemValidateState>
  validate: (trigger?: FormValidateTrigger, callback?: FormValidateCallback) => FormValidationResult
  resetField: () => void
  clearValidate: () => void
}
