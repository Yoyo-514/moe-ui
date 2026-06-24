<script setup lang="ts">
import { computed, provide } from 'vue'

import { RADIO_GROUP_CTX_KEY } from './types'
import { useFormDisabled, useFormSize } from '../../Form/src/hooks'
import { useFormItemValidate } from '../../Form/src/use-form-item'

import type { RadioGroupContext, RadioGroupEmits, RadioGroupProps, RadioValue } from './types'

defineOptions({
  name: 'MoeRadioGroup',
})

const props = withDefaults(defineProps<RadioGroupProps>(), {
  modelValue: undefined,
  disabled: undefined,
  size: undefined,
  name: undefined,
})

const emits = defineEmits<RadioGroupEmits>()
const { validate: validateFormItem } = useFormItemValidate()
const formSize = useFormSize('default')
const formDisabled = useFormDisabled()

const modelValue = computed(() => props.modelValue)
const groupDisabled = computed(() => props.disabled ?? formDisabled.value)
const groupSize = computed(() => props.size ?? formSize.value)
const groupName = computed(() => props.name || undefined)
const groupClasses = computed(() => [
  'moe-radio-group',
  `moe-radio-group--${groupSize.value}`,
  {
    'is-disabled': groupDisabled.value,
  },
])

function change(value: RadioValue) {
  emits('update:modelValue', value)
  emits('change', value)
  validateFormItem('change')
}

const context: RadioGroupContext = {
  modelValue,
  disabled: groupDisabled,
  size: groupSize,
  name: groupName,
  change,
}

provide(RADIO_GROUP_CTX_KEY, context)
</script>

<template>
  <div :class="groupClasses" role="radiogroup">
    <slot></slot>
  </div>
</template>
