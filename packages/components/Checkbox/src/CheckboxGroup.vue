<script setup lang="ts">
import { computed, provide } from 'vue'

import { CHECKBOX_GROUP_CTX_KEY } from './types'
import { useFormDisabled, useFormSize } from '../../Form/src/hooks'
import { useFormItemValidate } from '../../Form/src/use-form-item'

import type {
  CheckboxGroupContext,
  CheckboxGroupEmits,
  CheckboxGroupProps,
  CheckboxValue,
} from './types'

defineOptions({
  name: 'MoeCheckboxGroup',
})

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => [],
  disabled: undefined,
  size: undefined,
  min: undefined,
  max: undefined,
  validateEvent: true,
})

const emits = defineEmits<CheckboxGroupEmits>()
const { validate: validateFormItem } = useFormItemValidate()
const formSize = useFormSize('default')
const formDisabled = useFormDisabled()

const modelValue = computed(() => props.modelValue ?? [])
const groupDisabled = computed(() => props.disabled ?? formDisabled.value)
const groupSize = computed(() => props.size ?? formSize.value)
const min = computed(() => props.min)
const max = computed(() => props.max)
const groupClasses = computed(() => [
  'moe-checkbox-group',
  `moe-checkbox-group--${groupSize.value}`,
  {
    'is-disabled': groupDisabled.value,
  },
])

function change(value: CheckboxValue[]) {
  emits('update:modelValue', value)
  emits('change', value)
  if (props.validateEvent) validateFormItem('change')
}

const context: CheckboxGroupContext = {
  modelValue,
  disabled: groupDisabled,
  size: groupSize,
  min,
  max,
  change,
}

provide(CHECKBOX_GROUP_CTX_KEY, context)
</script>

<template>
  <div :class="groupClasses">
    <slot></slot>
  </div>
</template>
