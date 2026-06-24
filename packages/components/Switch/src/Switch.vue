<script setup lang="ts">
import { computed, ref } from 'vue'

import { SWITCH_DEFAULT_LOADING_ICON } from './constants'
import { useFormDisabled, useFormSize } from '../../Form/src/hooks'
import { useFormItemInputId, useFormItemValidate } from '../../Form/src/use-form-item'
import MoeIcon from '../../Icon/src/Icon.vue'

import type { SwitchEmits, SwitchIcon, SwitchInstance, SwitchProps, SwitchValue } from './types'

defineOptions({
  name: 'MoeSwitch',
})

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: undefined,
  loading: false,
  size: undefined,
  width: '',
  inlinePrompt: false,
  activeText: '',
  inactiveText: '',
  activeValue: true,
  inactiveValue: false,
  name: '',
  id: undefined,
})

const emits = defineEmits<SwitchEmits>()
const { validate: validateFormItem } = useFormItemValidate()

const switchRef = ref<HTMLButtonElement>()
const isPending = ref(false)

const checked = computed(() => props.modelValue === props.activeValue)
const switchSize = useFormSize('default')
const formDisabled = useFormDisabled()
const { inputId } = useFormItemInputId(props)
const switchDisabled = computed(() => formDisabled.value || props.loading || isPending.value)
const currentText = computed(() => (checked.value ? props.activeText : props.inactiveText))
const currentIcon = computed<SwitchIcon | undefined>(() =>
  checked.value ? props.activeIcon : props.inactiveIcon
)
const hasIcon = computed(() => Boolean(currentIcon.value))
const hasText = computed(() => Boolean(currentText.value))
const switchClasses = computed(() => [
  `moe-switch--${switchSize.value}`,
  {
    'is-checked': checked.value,
    'is-disabled': switchDisabled.value,
    'is-loading': props.loading || isPending.value,
    'is-inline-prompt': props.inlinePrompt,
  },
])
const switchStyle = computed(() => {
  if (props.width === '') return undefined

  return {
    '--moe-switch-core-width': typeof props.width === 'number' ? `${props.width}px` : props.width,
  }
})
const nextValue = computed<SwitchValue>(() =>
  checked.value ? props.inactiveValue : props.activeValue
)

function isStringIcon(icon: SwitchIcon | undefined): icon is string {
  return typeof icon === 'string'
}

async function canChange() {
  if (!props.beforeChange) return true

  try {
    const result = await props.beforeChange()
    return result !== false
  } catch {
    return false
  }
}

async function handleChange() {
  if (switchDisabled.value) return

  isPending.value = true
  const allowed = await canChange()
  isPending.value = false

  if (!allowed) return

  const value = nextValue.value
  emits('update:modelValue', value)
  emits('change', value)
  validateFormItem('change')
}

function focus() {
  switchRef.value?.focus()
}

defineExpose<SwitchInstance>({
  ref: switchRef,
  focus,
})
</script>

<template>
  <button
    :id="inputId"
    ref="switchRef"
    class="moe-switch"
    :class="switchClasses"
    :style="switchStyle"
    role="switch"
    type="button"
    :name="name || undefined"
    :disabled="switchDisabled"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click="handleChange"
    @keydown.enter.prevent="handleChange"
    @keydown.space.prevent="handleChange"
  >
    <span class="moe-switch__core">
      <span v-if="inlinePrompt && !hasIcon && hasText" class="moe-switch__inner">
        {{ currentText }}
      </span>
      <span class="moe-switch__action">
        <moe-icon
          v-if="loading || isPending"
          class="moe-switch__loading"
          :icon="SWITCH_DEFAULT_LOADING_ICON"
          animation="spin"
          size="sm"
        />
        <template v-else-if="hasIcon">
          <moe-icon v-if="isStringIcon(currentIcon)" :icon="currentIcon" size="sm" />
          <component :is="currentIcon" v-else />
        </template>
      </span>
    </span>
    <span v-if="!inlinePrompt && hasText" class="moe-switch__label">
      {{ currentText }}
    </span>
  </button>
</template>
