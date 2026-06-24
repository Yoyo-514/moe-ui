<script setup lang="ts">
import { computed, inject, ref } from 'vue'

import { RADIO_GROUP_CTX_KEY } from './types'
import { useFormDisabled, useFormSize } from '../../Form/src/hooks'
import { useFormItemInputId, useFormItemValidate } from '../../Form/src/use-form-item'

import type { RadioEmits, RadioInstance, RadioProps, RadioValue } from './types'

defineOptions({
  name: 'MoeRadio',
})

const props = withDefaults(defineProps<RadioProps>(), {
  modelValue: undefined,
  disabled: undefined,
  size: undefined,
  name: undefined,
  id: undefined,
})

const emits = defineEmits<RadioEmits>()
const group = inject(RADIO_GROUP_CTX_KEY, undefined)
const { validate: validateFormItem } = useFormItemValidate()
const { inputId } = useFormItemInputId(props)

const inputRef = ref<HTMLInputElement>()
const formSize = useFormSize('default')
const formDisabled = useFormDisabled()

const radioValue = computed<RadioValue>(() => props.value ?? props.label ?? '')
const isChecked = computed(
  () => (group ? group.modelValue.value : props.modelValue) === radioValue.value
)
const radioSize = computed(() => props.size ?? group?.size.value ?? formSize.value)
const radioDisabled = computed(() => props.disabled ?? group?.disabled.value ?? formDisabled.value)
const radioName = computed(() => props.name ?? group?.name.value)
const radioClasses = computed(() => [
  'moe-radio',
  `moe-radio--${radioSize.value}`,
  {
    'is-checked': isChecked.value,
    'is-disabled': radioDisabled.value,
  },
])

function emitChange(value: RadioValue) {
  emits('update:modelValue', value)
  emits('change', value)
}

function handleChange() {
  if (radioDisabled.value || isChecked.value) return

  if (group) group.change(radioValue.value)
  else emitChange(radioValue.value)

  validateFormItem('change')
}

function focus() {
  inputRef.value?.focus()
}

defineExpose<RadioInstance>({
  ref: inputRef,
  focus,
})
</script>

<template>
  <label :class="radioClasses">
    <span class="moe-radio__input">
      <input
        :id="inputId"
        ref="inputRef"
        class="moe-radio__original"
        type="radio"
        :name="radioName"
        :value="radioValue"
        :checked="isChecked"
        :disabled="radioDisabled"
        @change="handleChange"
      />
      <span class="moe-radio__inner"></span>
    </span>
    <span v-if="$slots.default || label !== undefined" class="moe-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
