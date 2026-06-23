import { shallowReactive } from 'vue'

import type { Arrayable } from '@moe-ui/utils'

import type {
  FormItemContext,
  FormItemProp,
  FormProps,
  FormValidateCallback,
  ValidateFieldsError,
} from './types'

function toArray<T>(value?: Arrayable<T>) {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

function getPropString(prop: FormItemProp) {
  return Array.isArray(prop) ? prop.join('.') : prop
}

function buildInvalidFields(field: FormItemContext, message: string): ValidateFieldsError {
  return {
    [field.propString]: [
      {
        message,
        field: field.propString,
        fieldValue: undefined,
      },
    ],
  }
}

function mergeInvalidFields(target: ValidateFieldsError, source?: ValidateFieldsError) {
  if (!source) return target

  Object.assign(target, source)
  return target
}

export interface UseFormOptions {
  props: FormProps
}

export function useForm({ props }: UseFormOptions) {
  const fields = shallowReactive<FormItemContext[]>([])

  function addField(field: FormItemContext) {
    if (!field.prop) return
    fields.push(field)
  }

  function removeField(field: FormItemContext) {
    const index = fields.indexOf(field)
    if (index > -1) fields.splice(index, 1)
  }

  function filterFields(props?: Arrayable<FormItemProp>) {
    const propList = toArray(props).map(getPropString)
    if (!propList.length) return fields

    return fields.filter((field) => propList.includes(field.propString))
  }

  async function validateField(
    props?: Arrayable<FormItemProp>,
    callback?: FormValidateCallback
  ): Promise<boolean> {
    const targetFields = filterFields(props)
    const invalidFields: ValidateFieldsError = {}
    let isValid = true

    for (const field of targetFields) {
      try {
        const fieldValid = await field.validate()
        if (!fieldValid) {
          isValid = false
          mergeInvalidFields(invalidFields, buildInvalidFields(field, field.validateMessage.value))
        }
      } catch {
        isValid = false
        mergeInvalidFields(invalidFields, buildInvalidFields(field, field.validateMessage.value))
      }
    }

    await callback?.(isValid, isValid ? undefined : invalidFields)
    return isValid
  }

  async function validate(callback?: FormValidateCallback) {
    const isValid = await validateField(undefined, callback)

    if (!isValid && props.scrollToError) {
      const firstErrorField = fields.find((field) => field.validateState.value === 'error')
      firstErrorField?.scrollToField()
    }

    return isValid
  }

  function resetFields(props?: Arrayable<FormItemProp>) {
    filterFields(props).forEach((field) => field.resetField())
  }

  function clearValidate(props?: Arrayable<FormItemProp>) {
    filterFields(props).forEach((field) => field.clearValidate())
  }

  function scrollToField(prop: FormItemProp) {
    const propString = getPropString(prop)
    fields.find((field) => field.propString === propString)?.scrollToField()
  }

  return {
    fields,
    addField,
    removeField,
    validate,
    validateField,
    resetFields,
    scrollToField,
    clearValidate,
  }
}
