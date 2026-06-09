<script lang="ts" setup>
import { throttle } from 'lodash-es'
import { computed, inject, ref } from 'vue'
import { useDisabledStyle } from '@moe-ui/hooks'
import MoeIcon from '../Icon/Icon.vue'
import { BUTTON_GROUP_CTX_KEY } from './constants'
import type { ButtonEmits, ButtonInstance, ButtonProps } from './types'

defineOptions({
  name: 'MoeButton',
})

const props = withDefaults(defineProps<ButtonProps>(), {
  tag: 'button',
  nativeType: 'button',
  useThrottle: true,
  throttleDuration: 500,
})

const emits = defineEmits<ButtonEmits>()
const slots = defineSlots()

const buttonGroupContext = inject(BUTTON_GROUP_CTX_KEY, undefined)
const buttonType = computed(() => props.type ?? buttonGroupContext?.type.value ?? '')
const buttonSize = computed(() => props.size ?? buttonGroupContext?.size.value ?? '')
const { disabledClass, isDisabled: buttonDisabled } = useDisabledStyle(
  () => props.disabled || buttonGroupContext?.disabled.value
)

const _ref = ref<HTMLElement>()

const iconStyle = computed(() => ({
  marginRight: slots.default ? '6px' : '0px',
}))
const handleBtnClick = (e: MouseEvent) => {
  if (buttonDisabled.value || props.loading) {
    e.preventDefault()
    e.stopPropagation()
    return
  }

  emits('click', e)
}
const handleBtnClickThrottle = throttle(handleBtnClick, props.throttleDuration)

defineExpose<ButtonInstance>({
  ref: _ref,
  type: buttonType,
  size: buttonSize,
  disabled: buttonDisabled,
})
</script>

<template>
  <component
    :is="tag"
    ref="_ref"
    class="moe-button"
    :autofocus="autofocus"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="buttonDisabled || loading ? true : void 0"
    :class="[
      {
        [`moe-button--${buttonType}`]: buttonType,
        [`moe-button--${buttonSize}`]: buttonSize,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
        'is-loading': loading,
      },
      disabledClass,
    ]"
    @click="(e: MouseEvent) => (useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e))"
  >
    <template v-if="loading">
      <slot name="loading">
        <moe-icon
          class="loading-icon"
          :icon="loadingIcon ?? 'mingcute:loading-line'"
          :style="iconStyle"
          size="md"
          animation="spin"
        />
      </slot>
    </template>
    <moe-icon v-if="icon && !loading" :icon="icon" :style="iconStyle" size="md" />
    <slot></slot>
  </component>
</template>
