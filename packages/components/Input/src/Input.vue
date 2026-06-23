<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, type CSSProperties } from 'vue'

import { isNumber } from 'lodash-es'

import { useFocusController, useGlobalSize } from '@moe-ui/hooks'

import {
  INPUT_CLEAR_ICON,
  INPUT_DEFAULT_RESIZE,
  INPUT_DEFAULT_ROWS,
  INPUT_DEFAULT_SIZE,
  INPUT_DEFAULT_TYPE,
  INPUT_PASSWORD_HIDDEN_ICON,
  INPUT_PASSWORD_VISIBLE_ICON,
  TEXTAREA_FALLBACK_LINE_HEIGHT,
} from './constants'
import { useFormContext, useFormItemValidate } from '../../Form/src/use-form-item'
import MoeIcon from '../../Icon/src/Icon.vue'

import type { InputElement, InputEmits, InputInstance, InputProps } from './types'

defineOptions({
  name: 'MoeInput',
})

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: INPUT_DEFAULT_TYPE,
  placeholder: '',
  disabled: undefined,
  readonly: false,
  clearable: false,
  showPassword: false,
  showWordLimit: false,
  autocomplete: 'off',
  size: undefined,
  autofocus: false,
  rows: INPUT_DEFAULT_ROWS,
  resize: INPUT_DEFAULT_RESIZE,
})

const emits = defineEmits<InputEmits>()
const { validate: validateFormItem } = useFormItemValidate()
const formContext = useFormContext()
const slots = defineSlots<{
  prefix?: () => unknown
  suffix?: () => unknown
  prepend?: () => unknown
  append?: () => unknown
}>()

const inputRef = ref<InputElement>()
const passwordVisible = ref(false)
const isHovering = ref(false)
const textareaHeight = ref<CSSProperties['height']>()
const textareaOverflowY = ref<CSSProperties['overflowY']>()

const isTextarea = computed(() => props.type === 'textarea')
const nativeInputValue = computed(() => (props.modelValue == null ? '' : String(props.modelValue)))
const globalSize = useGlobalSize()
const inputSize = computed(
  () => (props.size ?? formContext?.props.size ?? globalSize.value) || INPUT_DEFAULT_SIZE
)
const inputDisabled = computed(() => props.disabled ?? formContext?.props.disabled ?? false)

const textLength = computed(() => nativeInputValue.value.length)
const normalizedMaxlength = computed(() => {
  if (props.maxlength === undefined || props.maxlength === '') return undefined
  const maxlength = Number(props.maxlength)
  return Number.isFinite(maxlength) ? maxlength : undefined
})

const {
  isFocused,
  focus,
  blur,
  handleFocus: setFocused,
  handleBlur: setBlurred,
} = useFocusController({
  target: inputRef,
  beforeFocus: () => !inputDisabled.value,
})

const nativeInputType = computed(() => {
  if (props.showPassword && props.type === 'password') {
    return passwordVisible.value ? 'text' : 'password'
  }

  return props.type
})

const showClear = computed(
  () =>
    props.clearable &&
    !inputDisabled.value &&
    !props.readonly &&
    nativeInputValue.value.length > 0 &&
    (isFocused.value || isHovering.value)
)
const showPasswordToggle = computed(
  () => !isTextarea.value && props.showPassword && props.type === 'password' && !inputDisabled.value
)
const showWordLimit = computed(() => props.showWordLimit && normalizedMaxlength.value !== undefined)
const hasPrefix = computed(() => !isTextarea.value && Boolean(slots.prefix || props.prefixIcon))
const hasPlainSuffix = computed(
  () => !isTextarea.value && Boolean(slots.suffix || props.suffixIcon)
)
const renderClear = computed(() => !isTextarea.value && props.clearable)
const hasSuffix = computed(
  () => renderClear.value || showPasswordToggle.value || showWordLimit.value || hasPlainSuffix.value
)
const clearStyle = computed<CSSProperties>(() => ({
  visibility: showClear.value ? 'visible' : 'hidden',
}))
const inputClasses = computed(() => [
  `moe-input--${inputSize.value}`,
  {
    'is-disabled': inputDisabled.value,
    'is-readonly': props.readonly,
    'is-focus': isFocused.value,
    'is-textarea': isTextarea.value,
    'has-prepend': Boolean(slots.prepend) && !isTextarea.value,
    'has-append': Boolean(slots.append) && !isTextarea.value,
    'has-prefix': hasPrefix.value,
    'has-suffix': hasSuffix.value,
  },
])
const textareaStyle = computed<CSSProperties>(() => ({
  resize: props.resize,
  height: textareaHeight.value,
  overflowY: textareaOverflowY.value,
}))

function getElementValue(event: Event) {
  return (event.target as InputElement).value
}

function handleInput(event: Event) {
  const value = getElementValue(event)
  emits('update:modelValue', value)
  emits('input', value)

  if (isTextarea.value && props.autosize) {
    nextTick(resizeTextarea)
  }
}

function handleChange(event: Event) {
  emits('change', getElementValue(event))
  validateFormItem('change')
}

function handleFocus(event: FocusEvent) {
  setFocused()
  emits('focus', event)
}

function handleBlur(event: FocusEvent) {
  setBlurred()
  emits('blur', event)
  validateFormItem('blur')
}

function clear() {
  if (inputDisabled.value || props.readonly) return

  emits('update:modelValue', '')
  emits('input', '')
  emits('clear')

  nextTick(() => {
    focus()
    resizeTextarea()
  })
}

function togglePasswordVisible() {
  if (inputDisabled.value || props.readonly) return

  passwordVisible.value = !passwordVisible.value
  focus()
}

function select() {
  inputRef.value?.select()
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number.parseFloat(String(value))
  return Number.isFinite(number) ? number : fallback
}

function getTextareaRowsHeight(rows?: number) {
  if (!inputRef.value || !isTextarea.value || rows === undefined) return undefined

  const textarea = inputRef.value as HTMLTextAreaElement
  const style = window.getComputedStyle(textarea)
  const lineHeight = toNumber(style.lineHeight, TEXTAREA_FALLBACK_LINE_HEIGHT)
  const paddingTop = toNumber(style.paddingTop)
  const paddingBottom = toNumber(style.paddingBottom)
  const borderTop = toNumber(style.borderTopWidth)
  const borderBottom = toNumber(style.borderBottomWidth)

  return rows * lineHeight + paddingTop + paddingBottom + borderTop + borderBottom
}

function resizeTextarea() {
  if (!isTextarea.value || !props.autosize || !inputRef.value) return

  const textarea = inputRef.value as HTMLTextAreaElement
  const autosize = isNumber(props.autosize) ? false : props.autosize
  const minRows = typeof autosize === 'object' ? autosize.minRows : undefined
  const maxRows = typeof autosize === 'object' ? autosize.maxRows : undefined
  const minHeight = getTextareaRowsHeight(minRows)
  const maxHeight = getTextareaRowsHeight(maxRows)

  textarea.style.height = 'auto'
  let height = textarea.scrollHeight

  if (minHeight !== undefined) {
    height = Math.max(height, minHeight)
  }

  if (maxHeight !== undefined) {
    height = Math.min(height, maxHeight)
    textareaOverflowY.value = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  } else {
    textareaOverflowY.value = 'hidden'
  }

  const nextHeight = `${height}px`
  textarea.style.height = nextHeight
  textarea.style.overflowY = textareaOverflowY.value
  textareaHeight.value = nextHeight
}

watch(
  () => [props.modelValue, props.autosize, props.rows, props.type],
  () => nextTick(resizeTextarea),
  { immediate: true }
)

onMounted(() => {
  resizeTextarea()
})

defineExpose<InputInstance>({
  inputRef,
  focus,
  blur,
  select,
  clear,
})
</script>

<template>
  <div
    class="moe-input"
    :class="inputClasses"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <template v-if="isTextarea">
      <div class="moe-input__textarea-wrapper">
        <textarea
          :id="id"
          ref="inputRef"
          class="moe-input__textarea"
          :value="nativeInputValue"
          :placeholder="placeholder"
          :disabled="inputDisabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :minlength="minlength"
          :autocomplete="autocomplete"
          :name="name"
          :form="form"
          :autofocus="autofocus"
          :tabindex="tabindex"
          :rows="rows"
          :style="textareaStyle"
          :aria-disabled="inputDisabled || undefined"
          :aria-readonly="readonly || undefined"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        ></textarea>
        <button
          v-if="showClear"
          class="moe-input__textarea-clear"
          type="button"
          aria-label="清空输入"
          @mousedown.prevent
          @click="clear"
        >
          <moe-icon :icon="INPUT_CLEAR_ICON" size="md" />
        </button>
        <span v-if="showWordLimit" class="moe-input__textarea-word-limit">
          {{ textLength }} / {{ normalizedMaxlength }}
        </span>
      </div>
    </template>

    <template v-else>
      <div v-if="$slots.prepend" class="moe-input__prepend">
        <slot name="prepend"></slot>
      </div>

      <div class="moe-input__wrapper">
        <span v-if="hasPrefix" class="moe-input__prefix">
          <slot name="prefix">
            <component :is="prefixIcon" v-if="prefixIcon && typeof prefixIcon !== 'string'" />
            <moe-icon v-else-if="prefixIcon" :icon="prefixIcon" size="md" />
          </slot>
        </span>

        <input
          :id="id"
          ref="inputRef"
          class="moe-input__inner"
          :value="nativeInputValue"
          :type="nativeInputType"
          :placeholder="placeholder"
          :disabled="inputDisabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :minlength="minlength"
          :autocomplete="autocomplete"
          :name="name"
          :form="form"
          :autofocus="autofocus"
          :tabindex="tabindex"
          :aria-disabled="inputDisabled || undefined"
          :aria-readonly="readonly || undefined"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />

        <span v-if="hasSuffix" class="moe-input__suffix">
          <button
            v-if="renderClear"
            class="moe-input__clear"
            type="button"
            aria-label="清空输入"
            :style="clearStyle"
            @mousedown.prevent
            @click="clear"
          >
            <moe-icon :icon="INPUT_CLEAR_ICON" size="md" />
          </button>
          <button
            v-if="showPasswordToggle"
            class="moe-input__password"
            type="button"
            :aria-label="passwordVisible ? '隐藏密码' : '显示密码'"
            @mousedown.prevent
            @click="togglePasswordVisible"
          >
            <moe-icon
              :icon="passwordVisible ? INPUT_PASSWORD_HIDDEN_ICON : INPUT_PASSWORD_VISIBLE_ICON"
              size="md"
            />
          </button>
          <span v-if="showWordLimit" class="moe-input__word-limit">
            {{ textLength }} / {{ normalizedMaxlength }}
          </span>
          <slot name="suffix">
            <component :is="suffixIcon" v-if="suffixIcon && typeof suffixIcon !== 'string'" />
            <moe-icon v-else-if="suffixIcon" :icon="suffixIcon" size="md" />
          </slot>
        </span>
      </div>

      <div v-if="$slots.append" class="moe-input__append">
        <slot name="append"></slot>
      </div>
    </template>
  </div>
</template>
