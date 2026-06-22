<script setup lang="ts">
import { computed, provide } from 'vue'
import {
  FORM_DEFAULT_LABEL_POSITION,
  FORM_DEFAULT_REQUIRE_ASTERISK_POSITION,
  FORM_CONTEXT_KEY,
  FORM_DEFAULT_SCROLL_TO_ERROR,
  FORM_DEFAULT_SHOW_MESSAGE,
} from './constants'
import { useForm } from './use-form'
import type { FormContext, FormEmits, FormInstance, FormProps, FormSlots } from './types'

const COMPONENT_NAME = 'MoeForm'

defineOptions({
  name: COMPONENT_NAME,
})

const props = withDefaults(defineProps<FormProps>(), {
  inline: false,
  labelPosition: FORM_DEFAULT_LABEL_POSITION,
  labelWidth: '',
  labelSuffix: '',
  hideRequiredAsterisk: false,
  requireAsteriskPosition: FORM_DEFAULT_REQUIRE_ASTERISK_POSITION,
  showMessage: FORM_DEFAULT_SHOW_MESSAGE,
  inlineMessage: false,
  disabled: false,
  scrollToError: FORM_DEFAULT_SCROLL_TO_ERROR,
})

const emit = defineEmits<FormEmits>()
defineSlots<FormSlots>()

const model = computed(() => props.model)
const formClasses = computed(() => [
  'moe-form',
  `moe-form--label-${props.labelPosition}`,
  {
    'is-inline': props.inline,
  },
])
const {
  fields,
  addField,
  removeField,
  validate,
  validateField,
  resetFields,
  scrollToField,
  clearValidate,
} = useForm({ props })

const context: FormContext = {
  props,
  model,
  fields,
  addField,
  removeField,
  emitValidate(prop, isValid, message) {
    emit('validate', prop, isValid, message)
  },
}

provide(FORM_CONTEXT_KEY, context)

defineExpose<FormInstance>({
  validate,
  validateField,
  resetFields,
  scrollToField,
  clearValidate,
})
</script>

<template>
  <form :class="formClasses">
    <slot></slot>
  </form>
</template>
