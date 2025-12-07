<script lang="ts" setup>
import { throttle } from 'lodash-es'
import { computed, ref } from 'vue'
import MoeIcon from '../Icon/Icon.vue'
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

const _ref = ref<HTMLButtonElement>()
const iconStyle = computed(() => ({
  marginRight: slots.default ? '6px' : '0px',
}))
const handleBtnClick = (e: MouseEvent) => emits('click', e)
const handleBtnClickThrottle = throttle(handleBtnClick, props.throttleDuration)

defineExpose<ButtonInstance>({
  ref: _ref,
})
</script>

<template>
  <component
    :is="tag"
    ref="_ref"
    class="moe-button"
    :autofocus="autofocus"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : void 0"
    :class="{
      [`moe-button--${type}`]: type,
      [`moe-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
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

<style lang="scss" scoped>
@use './style.scss';
</style>
