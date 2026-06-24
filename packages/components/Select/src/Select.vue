<script setup lang="ts">
import { computed, nextTick, provide, ref, useId } from 'vue'

import { useLocale } from '@moe-ui/hooks'

import { SELECT_CTX_KEY, SELECT_DEFAULT_PROPS, SELECT_EMPTY_VALUES } from './constants'
import { useKeyMap } from './useKeyMap'
import { useFormDisabled, useFormSize } from '../../Form/src/hooks'
import { useFormItemValidate } from '../../Form/src/use-form-item'
import MoeIcon from '../../Icon/src/Icon.vue'
import MoeInput from '../../Input/src/Input.vue'
import MoeTooltip from '../../Tooltip/src/Tooltip.vue'

import type {
  NormalizedSelectOption,
  SelectEmits,
  SelectInstance,
  SelectModelValue,
  SelectOption,
  SelectProps,
} from './types'
import type { InputInstance } from '../../Input/src/types'

defineOptions({
  name: 'MoeSelect',
})

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: undefined,
  options: () => [],
  props: () => ({}),
  disabled: undefined,
  size: undefined,
  clearable: false,
  filterable: false,
  loading: false,
  loadingText: undefined,
  noMatchText: undefined,
  noDataText: undefined,
  placeholder: undefined,
  name: '',
  id: undefined,
  valueKey: 'value',
  emptyValues: () => [...SELECT_EMPTY_VALUES],
  valueOnClear: '',
})

const emits = defineEmits<SelectEmits>()
const { t } = useLocale()
const { validate: validateFormItem } = useFormItemValidate()

const selectRef = ref<HTMLElement>()
const inputRef = ref<InputInstance>()
const visible = ref(false)
const query = ref('')
const hoverIndex = ref(-1)
const registeredOptions = ref<NormalizedSelectOption[]>([])
const listboxId = `moe-select-listbox-${useId()}`

const selectSize = useFormSize('default')
const selectDisabled = useFormDisabled()

const optionProps = computed(() => ({ ...SELECT_DEFAULT_PROPS, ...props.props }))
const normalizedOptions = computed(() => [
  ...props.options.map(normalizeOption),
  ...registeredOptions.value,
])
const filteredOptions = computed(() => {
  if (!props.filterable || !query.value) return normalizedOptions.value

  const normalizedQuery = query.value.toLowerCase()
  return normalizedOptions.value.filter((option) => {
    if (props.filterMethod) return props.filterMethod(query.value, option.raw)
    return option.label.toLowerCase().includes(normalizedQuery)
  })
})
const selectedOption = computed(() =>
  normalizedOptions.value.find((option) => isEqualValue(option.value, props.modelValue))
)
const selectedLabel = computed(() => selectedOption.value?.label ?? '')
const isEmptyValue = computed(() =>
  props.emptyValues.some((value) => isEqualValue(value, props.modelValue))
)
const showClear = computed(
  () => props.clearable && !selectDisabled.value && !isEmptyValue.value && !props.loading
)
const placeholderText = computed(() => props.placeholder ?? t('select.placeholder'))
const loadingText = computed(() => props.loadingText ?? t('select.loading'))
const emptyText = computed(() =>
  query.value
    ? (props.noMatchText ?? t('select.noMatch'))
    : (props.noDataText ?? t('select.noData'))
)
const displayValue = computed(() =>
  props.filterable && visible.value ? query.value : selectedLabel.value
)
const selectClasses = computed(() => [
  `moe-select--${selectSize.value}`,
  {
    'is-disabled': selectDisabled.value,
    'is-opened': visible.value,
    'is-filterable': props.filterable,
  },
])
const dropdownStyle = computed(() => ({
  width: selectRef.value ? `${selectRef.value.offsetWidth}px` : undefined,
}))

const handleKeydown = useKeyMap({
  next: hoverNext,
  prev: hoverPrev,
  select: selectHoverOption,
  close: closeMenu,
})

function getValueKey(value: SelectModelValue) {
  if (value && typeof value === 'object') return value[props.valueKey]
  return value
}

function isEqualValue(a: SelectModelValue, b: SelectModelValue) {
  return Object.is(getValueKey(a), getValueKey(b))
}

function normalizeOption(option: SelectOption): NormalizedSelectOption {
  const valueKey = optionProps.value.value
  const labelKey = optionProps.value.label
  const disabledKey = optionProps.value.disabled
  const value = option[valueKey] as SelectModelValue
  const rawLabel = option[labelKey]

  return {
    value,
    label: String(rawLabel ?? value),
    disabled: Boolean(option[disabledKey]),
    raw: option,
  }
}

function getOptionKey(option: NormalizedSelectOption) {
  const key = getValueKey(option.value)
  return typeof key === 'string' || typeof key === 'number' ? key : option.label
}

function setVisible(value: boolean) {
  if (visible.value === value) return

  visible.value = value
  emits('visible-change', value)
}

function findFirstEnabledIndex(options = filteredOptions.value) {
  return options.findIndex((option) => !option.disabled)
}

async function openMenu() {
  if (selectDisabled.value) return

  query.value = ''
  setVisible(true)
  hoverIndex.value = selectedOption.value
    ? filteredOptions.value.findIndex((option) =>
        isEqualValue(option.value, selectedOption.value?.value)
      )
    : findFirstEnabledIndex()
  await nextTick()
  await inputRef.value?.focus()
}

function closeMenu() {
  setVisible(false)
  query.value = ''
  hoverIndex.value = -1
}

function toggleMenu() {
  if (visible.value) {
    closeMenu()
    return
  }

  openMenu()
}

function handleTooltipVisibleChange(value: boolean) {
  if (value) {
    openMenu()
    return
  }

  closeMenu()
}

function handleTriggerMouseDown(event: MouseEvent) {
  if (selectDisabled.value) return
  if (!props.filterable) event.preventDefault()
  toggleMenu()
}

function emitChange(value: SelectModelValue) {
  emits('update:modelValue', value)
  emits('change', value)
  validateFormItem('change')
}

function selectOption(option: NormalizedSelectOption) {
  if (selectDisabled.value || props.loading || option.disabled) return

  emitChange(option.value)
  closeMenu()
}

function clearValue() {
  if (!showClear.value) return

  emitChange(props.valueOnClear)
  emits('clear')
  closeMenu()
}

function handleInput(value: string) {
  query.value = value
  if (!visible.value) setVisible(true)
  hoverIndex.value = findFirstEnabledIndex()
}

function handleFocus(event: FocusEvent) {
  emits('focus', event)
}

function handleBlur(event: FocusEvent) {
  emits('blur', event)
  validateFormItem('blur')
}

function hoverNext() {
  if (!visible.value) {
    openMenu()
    return
  }

  moveHover(1)
}

function hoverPrev() {
  if (!visible.value) {
    openMenu()
    return
  }

  moveHover(-1)
}

function moveHover(step: 1 | -1) {
  const options = filteredOptions.value
  if (!options.length) return

  let next = hoverIndex.value
  for (let i = 0; i < options.length; i += 1) {
    next = (next + step + options.length) % options.length
    if (!options[next].disabled) {
      hoverIndex.value = next
      return
    }
  }
}

function selectHoverOption() {
  if (!visible.value) {
    openMenu()
    return
  }

  const option = filteredOptions.value[hoverIndex.value]
  if (option) selectOption(option)
}

async function focus() {
  await inputRef.value?.focus()
}

function blur() {
  inputRef.value?.blur()
  closeMenu()
}

function registerOption(option: NormalizedSelectOption) {
  const index = registeredOptions.value.findIndex((item) => isEqualValue(item.value, option.value))
  if (index >= 0) {
    registeredOptions.value[index] = option
    return
  }

  registeredOptions.value.push(option)
}

function unregisterOption(value: SelectModelValue) {
  registeredOptions.value = registeredOptions.value.filter(
    (option) => !isEqualValue(option.value, value)
  )
}

provide(SELECT_CTX_KEY, {
  registerOption,
  unregisterOption,
})

defineExpose<SelectInstance>({
  ref: selectRef,
  focus,
  blur,
  selectedLabel,
})
</script>

<template>
  <div ref="selectRef" class="moe-select" :class="selectClasses" @keydown="handleKeydown">
    <div class="moe-select__options-source">
      <slot></slot>
    </div>

    <moe-tooltip
      :visible="visible"
      trigger="manual"
      placement="bottom-start"
      effect="light"
      :offset="6"
      transition="moe-select-fade"
      popper-class="moe-select__popper"
      :show-arrow="false"
      :hide-on-click-outside="true"
      @update:visible="handleTooltipVisibleChange"
    >
      <moe-input
        :id="id"
        ref="inputRef"
        class="moe-select__input"
        :model-value="displayValue"
        :readonly="!filterable"
        :placeholder="selectedLabel ? '' : placeholderText"
        :disabled="selectDisabled"
        :name="name || undefined"
        :size="selectSize || undefined"
        autocomplete="off"
        role="combobox"
        :aria-expanded="visible"
        :aria-controls="listboxId"
        aria-autocomplete="list"
        @mousedown="handleTriggerMouseDown"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <template #suffix>
          <button
            v-if="showClear"
            class="moe-select__clear"
            type="button"
            aria-label="清空选择"
            @mousedown.stop.prevent="clearValue"
          >
            <moe-icon icon="mingcute:close-circle-line" size="md" />
          </button>
          <moe-icon v-else class="moe-select__suffix" icon="mingcute:down-line" size="md" />
        </template>
      </moe-input>

      <template #content>
        <div class="moe-select__dropdown" :style="dropdownStyle">
          <div v-if="loading" class="moe-select__empty">
            {{ loadingText }}
          </div>
          <div v-else-if="filteredOptions.length === 0" class="moe-select__empty">
            {{ emptyText }}
          </div>
          <ul v-else :id="listboxId" class="moe-select__list" role="listbox">
            <li
              v-for="(option, index) in filteredOptions"
              :key="getOptionKey(option)"
              class="moe-select__option"
              :class="{
                'is-selected': isEqualValue(option.value, modelValue),
                'is-disabled': option.disabled,
                'is-hovering': index === hoverIndex,
              }"
              role="option"
              :aria-selected="isEqualValue(option.value, modelValue)"
              @mouseenter="hoverIndex = index"
              @mousedown.prevent="selectOption(option)"
            >
              {{ option.label }}
            </li>
          </ul>
        </div>
      </template>
    </moe-tooltip>
  </div>
</template>
