<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

import { ALERT_ICON_MAP } from './constants'
import MoeIcon from '../../Icon/src/Icon.vue'

import type { AlertEmits, AlertInstance, AlertProps } from './types'

defineOptions({
  name: 'MoeAlert',
})

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  closable: true,
  showIcon: false,
  center: false,
  effect: 'light',
})

const emits = defineEmits<AlertEmits>()
const slots = useSlots()
const visible = ref(true)

const iconName = computed(() => ALERT_ICON_MAP[props.type])
const hasIcon = computed(() => Boolean(props.showIcon || slots.icon))
const hasDescription = computed(() => Boolean(props.description || slots.default))

const open = () => {
  visible.value = true
}

const close = (event?: MouseEvent) => {
  visible.value = false
  emits('close', event)
}

defineExpose<AlertInstance>({
  open,
  close,
})
</script>

<template>
  <transition name="moe-alert-fade">
    <div
      v-if="visible"
      class="moe-alert"
      :class="[
        `moe-alert--${type}`,
        `is-${effect}`,
        {
          'is-center': center,
          'is-with-description': hasDescription,
        },
      ]"
      role="alert"
    >
      <span v-if="hasIcon" class="moe-alert__icon">
        <slot name="icon">
          <moe-icon :icon="iconName" />
        </slot>
      </span>
      <div class="moe-alert__content">
        <div v-if="title || $slots.title" class="moe-alert__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="hasDescription" class="moe-alert__description">
          <slot>{{ description }}</slot>
        </div>
      </div>
      <button
        v-if="closable"
        class="moe-alert__close"
        type="button"
        aria-label="关闭提示"
        @click="close"
      >
        <template v-if="closeText">{{ closeText }}</template>
        <moe-icon v-else icon="mingcute:close-line" size="md" />
      </button>
    </div>
  </transition>
</template>
