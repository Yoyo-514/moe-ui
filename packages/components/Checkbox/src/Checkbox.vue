<script setup lang="ts">
import { computed, inject, ref } from 'vue'

import { CHECKBOX_GROUP_CTX_KEY } from './types'
import { useFormDisabled, useFormSize } from '../../Form/src/hooks'
import { useFormItemInputId, useFormItemValidate } from '../../Form/src/use-form-item'

import type {
  CheckboxEmits,
  CheckboxInstance,
  CheckboxModelValue,
  CheckboxProps,
  CheckboxValue,
} from './types'

defineOptions({
  name: 'MoeCheckbox',
})

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  trueValue: true,
  falseValue: false,
  disabled: undefined,
  size: undefined,
  name: undefined,
  id: undefined,
  indeterminate: false,
})

const emits = defineEmits<CheckboxEmits>()
const group = inject(CHECKBOX_GROUP_CTX_KEY, undefined)
const { validate: validateFormItem } = useFormItemValidate()
const { inputId } = useFormItemInputId(props)

const inputRef = ref<HTMLInputElement>()
const formSize = useFormSize('default')
const formDisabled = useFormDisabled()

const checkboxValue = computed<CheckboxValue>(() => props.value ?? props.label ?? props.trueValue)
const currentArray = computed(() => {
  if (group) return group.modelValue.value
  return Array.isArray(props.modelValue) ? props.modelValue : undefined
})
const isChecked = computed(() => {
  const arrayValue = currentArray.value
  if (arrayValue) return arrayValue.includes(checkboxValue.value)

  return props.modelValue === props.trueValue
})
const checkboxSize = computed(() => props.size ?? group?.size.value ?? formSize.value)
const isLimitDisabled = computed(() => {
  if (!group) return false

  const value = group.modelValue.value
  const min = group.min.value
  const max = group.max.value

  return Boolean(
    (max !== undefined && value.length >= max && !isChecked.value) ||
    (min !== undefined && value.length <= min && isChecked.value)
  )
})
const checkboxDisabled = computed(
  () => (props.disabled ?? group?.disabled.value ?? formDisabled.value) || isLimitDisabled.value
)
const checkboxName = computed(() => props.name ?? group?.name.value)
const checkboxClasses = computed(() => [
  'moe-checkbox',
  `moe-checkbox--${checkboxSize.value}`,
  {
    'is-checked': isChecked.value,
    'is-disabled': checkboxDisabled.value,
    'is-indeterminate': props.indeterminate,
  },
])

function toggleArrayValue(value: CheckboxValue[], checked: boolean) {
  if (checked) return value.includes(checkboxValue.value) ? value : [...value, checkboxValue.value]

  return value.filter((item) => item !== checkboxValue.value)
}

function emitChange(value: CheckboxModelValue) {
  emits('update:modelValue', value)
  emits('change', value)
}

function handleChange(event: Event) {
  if (checkboxDisabled.value) return

  const checked = (event.target as HTMLInputElement).checked
  const arrayValue = currentArray.value

  if (group) {
    group.change(toggleArrayValue(group.modelValue.value, checked))
  } else if (arrayValue) {
    emitChange(toggleArrayValue(arrayValue, checked))
  } else {
    emitChange(checked ? props.trueValue : props.falseValue)
  }

  validateFormItem('change')
}

function focus() {
  inputRef.value?.focus()
}

defineExpose<CheckboxInstance>({
  ref: inputRef,
  focus,
})
</script>

<template>
  <label :class="checkboxClasses">
    <span class="moe-checkbox__input">
      <input
        :id="inputId"
        ref="inputRef"
        class="moe-checkbox__original"
        type="checkbox"
        :name="checkboxName"
        :value="checkboxValue"
        :checked="isChecked"
        :disabled="checkboxDisabled"
        :indeterminate.prop="indeterminate"
        @change="handleChange"
      />
      <span class="moe-checkbox__inner"></span>
    </span>
    <span v-if="$slots.default || label !== undefined" class="moe-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
