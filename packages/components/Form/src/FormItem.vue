<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, useId, watch } from 'vue'

import Schema from 'async-validator'

import { useGlobalSize } from '@moe-ui/hooks'

import type { Arrayable } from '@moe-ui/utils'

import {
  FORM_CONTEXT_KEY,
  FORM_DEFAULT_INLINE_MESSAGE,
  FORM_DEFAULT_LABEL_POSITION,
  FORM_DEFAULT_SHOW_MESSAGE,
  FORM_DEFAULT_SIZE,
  FORM_ITEM_CONTEXT_KEY,
} from './constants'

import type {
  FormItemContext,
  FormItemInstance,
  FormItemProps,
  FormItemRule,
  FormItemSlots,
  FormItemValidateState,
  FormValidateCallback,
  FormValidateTrigger,
} from './types'
import type { RuleItem, ValidateError } from 'async-validator'

const COMPONENT_NAME = 'MoeFormItem'

defineOptions({
  name: COMPONENT_NAME,
})

const props = withDefaults(defineProps<FormItemProps>(), {
  labelPosition: '',
  showMessage: undefined,
  required: undefined,
  inlineMessage: undefined,
  validateStatus: '',
})

const _slots = defineSlots<FormItemSlots>()
const formContext = inject(FORM_CONTEXT_KEY, undefined)
const formItemRef = ref<HTMLDivElement>()
const inputIds = ref<string[]>([])
const validateStateInner = ref<FormItemValidateState>('')
const validateMessageInner = ref('')
let initialValue: unknown

function toArray<T>(value?: Arrayable<T>) {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

function getPropSegments(prop?: Arrayable<string>) {
  if (!prop) return []
  return Array.isArray(prop) ? prop : prop.split('.').filter(Boolean)
}

function getPropString(prop?: Arrayable<string>) {
  return getPropSegments(prop).join('.')
}

function getValueByPath(source: Record<string, unknown>, prop?: Arrayable<string>) {
  return getPropSegments(prop).reduce<unknown>((value, key) => {
    if (value == null || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[key]
  }, source)
}

function setValueByPath(
  source: Record<string, unknown>,
  prop: Arrayable<string> | undefined,
  value: unknown
) {
  const segments = getPropSegments(prop)
  if (!segments.length) return

  const lastKey = segments[segments.length - 1]
  if (!lastKey) return

  let target: Record<string, unknown> | undefined = source
  for (const key of segments.slice(0, -1)) {
    const next = target[key]
    if (next == null || typeof next !== 'object') {
      target = undefined
      break
    }
    target = next as Record<string, unknown>
  }

  if (!target) return
  target[lastKey] = value
}

function cloneValue(value: unknown) {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      return value
    }
  }

  if (Array.isArray(value)) return [...value]
  if (value && typeof value === 'object') return { ...(value as Record<string, unknown>) }

  return value
}

const propString = computed(() => getPropString(props.prop))
const modelValue = computed(() => getValueByPath(formContext?.model.value ?? {}, props.prop))
const globalSize = useGlobalSize()
const size = computed(
  () => (props.size ?? formContext?.props.size ?? globalSize.value) || FORM_DEFAULT_SIZE
)
const labelPosition = computed(
  () => props.labelPosition || formContext?.props.labelPosition || FORM_DEFAULT_LABEL_POSITION
)
const labelWidth = computed(() => props.labelWidth ?? formContext?.props.labelWidth ?? '')
const showMessage = computed(
  () => props.showMessage ?? formContext?.props.showMessage ?? FORM_DEFAULT_SHOW_MESSAGE
)
const inlineMessage = computed(
  () => props.inlineMessage ?? formContext?.props.inlineMessage ?? FORM_DEFAULT_INLINE_MESSAGE
)
const validateState = computed<FormItemValidateState>(
  () => props.validateStatus || validateStateInner.value
)
const validateMessage = computed(() => props.error || validateMessageInner.value)
const normalizedRules = computed<FormItemRule[]>(() => {
  const formRules = formContext?.props.rules ?? {}
  const propRules = propString.value ? formRules[propString.value] : undefined
  const rules = [...toArray(propRules), ...toArray(props.rules)]

  if (props.required !== undefined) {
    const requiredRule: FormItemRule = { required: props.required }
    const hasRequiredRule = rules.some((rule) =>
      Object.prototype.hasOwnProperty.call(rule, 'required')
    )

    if (hasRequiredRule) {
      rules.forEach((rule) => {
        if (Object.prototype.hasOwnProperty.call(rule, 'required')) rule.required = props.required
      })
    } else {
      rules.push(requiredRule)
    }
  }

  return rules
})
const isRequired = computed(() => normalizedRules.value.some((rule) => rule.required))
const formItemClasses = computed(() => [
  'moe-form-item',
  `moe-form-item--label-${labelPosition.value}`,
  `moe-form-item--${size.value}`,
  {
    'is-required': isRequired.value,
    'is-error': validateState.value === 'error',
    'is-success': validateState.value === 'success',
    'is-validating': validateState.value === 'validating',
    'is-inline-message': inlineMessage.value,
    'asterisk-left': formContext?.props.requireAsteriskPosition === 'left',
    'asterisk-right': formContext?.props.requireAsteriskPosition === 'right',
    'is-no-asterisk': formContext?.props.hideRequiredAsterisk,
  },
])
const labelStyle = computed(() => {
  const width = labelWidth.value
  if (width === '' || width === undefined) return undefined

  return {
    width: typeof width === 'number' ? `${width}px` : width,
  }
})
const labelContent = computed(() => `${props.label ?? ''}${formContext?.props.labelSuffix ?? ''}`)
const hasLabel = computed(() => Boolean(props.label || _slots.label))
const labelId = `moe-form-item-label-${useId()}`
const labelFor = computed(
  () => props.for ?? (inputIds.value.length === 1 ? inputIds.value[0] : undefined)
)
const labelTag = computed(() => (labelFor.value ? 'label' : 'div'))
const isGroup = computed(() => Boolean(!labelFor.value && hasLabel.value))

function getFilteredRules(trigger?: FormValidateTrigger): RuleItem[] {
  return normalizedRules.value
    .filter((rule) => {
      if (!rule.trigger || !trigger) return true
      return toArray(rule.trigger).includes(trigger)
    })
    .map(({ trigger: _trigger, ...rule }) => rule)
}

function setValidationState(state: FormItemValidateState, message = '') {
  validateStateInner.value = state
  validateMessageInner.value = message
}

function getFirstErrorMessage(error?: unknown) {
  const errors = (error as { errors?: ValidateError[] })?.errors
  return errors?.[0]?.message ?? 'Validation failed'
}

async function validate(trigger?: FormValidateTrigger, callback?: FormValidateCallback) {
  if (!props.prop) {
    await callback?.(true)
    return true
  }

  const rules = getFilteredRules(trigger)
  if (!rules.length) {
    await callback?.(true)
    return true
  }

  setValidationState('validating')

  try {
    const schema = new Schema({ [propString.value]: rules })
    await schema.validate({ [propString.value]: modelValue.value })
    setValidationState('success')
    formContext?.emitValidate(props.prop, true, '')
    await callback?.(true)
    return true
  } catch (error) {
    const message = getFirstErrorMessage(error)
    setValidationState('error', message)
    formContext?.emitValidate(props.prop, false, message)
    await callback?.(false, (error as { fields?: Record<string, ValidateError[]> })?.fields)
    return false
  }
}

function clearValidate() {
  setValidationState('')
}

function resetField() {
  if (!props.prop) return
  setValueByPath(formContext?.model.value ?? {}, props.prop, cloneValue(initialValue))
  clearValidate()
}

function scrollToField() {
  formItemRef.value?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}

function addInputId(id: string) {
  if (!inputIds.value.includes(id)) inputIds.value.push(id)
}

function removeInputId(id: string) {
  inputIds.value = inputIds.value.filter((inputId) => inputId !== id)
}

const fieldContext: FormItemContext = {
  prop: props.prop,
  propString: propString.value,
  size,
  validateState,
  validateMessage,
  labelId,
  hasLabel,
  isGroup,
  inputIds,
  addInputId,
  removeInputId,
  validate,
  resetField,
  clearValidate,
  scrollToField,
}

provide(FORM_ITEM_CONTEXT_KEY, fieldContext)

onMounted(() => {
  initialValue = cloneValue(modelValue.value)
  if (props.prop) formContext?.addField(fieldContext)
})

onBeforeUnmount(() => {
  formContext?.removeField(fieldContext)
})

watch(propString, (value, oldValue) => {
  fieldContext.prop = props.prop
  fieldContext.propString = value

  if (oldValue && value !== oldValue) {
    formContext?.removeField(fieldContext)
    if (props.prop) formContext?.addField(fieldContext)
  }
})

watch(
  () => props.error,
  (error) => {
    if (error) setValidationState('error', error)
    else if (validateStateInner.value === 'error') clearValidate()
  },
  { immediate: true }
)

watch(
  () => props.validateStatus,
  (status) => {
    if (status) validateStateInner.value = status
  },
  { immediate: true }
)

defineExpose<FormItemInstance>({
  size,
  validateMessage,
  validateState,
  validate,
  resetField,
  clearValidate,
})
</script>

<template>
  <div
    ref="formItemRef"
    :class="formItemClasses"
    :role="isGroup ? 'group' : undefined"
    :aria-labelledby="isGroup ? labelId : undefined"
  >
    <component
      :is="labelTag"
      v-if="hasLabel"
      :id="labelId"
      class="moe-form-item__label"
      :for="labelFor"
      :style="labelStyle"
    >
      <slot name="label" :label="labelContent">
        {{ labelContent }}
      </slot>
    </component>

    <div class="moe-form-item__content">
      <slot></slot>

      <div v-if="showMessage && validateMessage" class="moe-form-item__error">
        <slot name="error" :error="validateMessage">
          {{ validateMessage }}
        </slot>
      </div>
    </div>
  </div>
</template>
