<script setup lang="ts">
import { computed, isVNode, onMounted, ref } from 'vue'
import { isFunction, toNumber } from 'lodash-es'
import { useOffset, useTimeout } from '@moe-ui/hooks'
import MoeIcon from '../../Icon/src/Icon.vue'
import {
  NOTIFICATION_DEFAULT_DURATION,
  NOTIFICATION_DEFAULT_OFFSET,
  NOTIFICATION_DEFAULT_POSITION,
  NOTIFICATION_DEFAULT_TYPE,
  NOTIFICATION_HORIZONTAL_OFFSET,
  NOTIFICATION_ICON_MAP,
} from './constants'
import type {
  NotificationEmits,
  NotificationExposed,
  NotificationProps,
  NotificationType,
} from './types'

const props = withDefaults(defineProps<NotificationProps>(), {
  title: '',
  message: '',
  type: NOTIFICATION_DEFAULT_TYPE,
  duration: NOTIFICATION_DEFAULT_DURATION,
  position: NOTIFICATION_DEFAULT_POSITION,
  showClose: true,
  offset: NOTIFICATION_DEFAULT_OFFSET,
})

const emits = defineEmits<NotificationEmits>()
const visible = ref(false)
const timer = useTimeout()

const normalizedType = computed<NotificationType>(() =>
  props.type === 'error' ? 'danger' : (props.type ?? NOTIFICATION_DEFAULT_TYPE)
)
const verticalPosition = computed(() => (props.position.startsWith('top') ? 'top' : 'bottom'))
const horizontalPosition = computed(() => (props.position.endsWith('right') ? 'right' : 'left'))
const iconComponent = computed(() => {
  if (props.icon !== undefined) return props.icon
  return NOTIFICATION_ICON_MAP[normalizedType.value]
})
const hasIcon = computed(() => Boolean(iconComponent.value))
const isVNodeMessage = computed(() => isVNode(props.message) || isFunction(props.message))
const messageRenderer = computed(() => {
  if (isFunction(props.message)) return props.message
  if (isVNodeMessage.value) return () => props.message
  return undefined
})
const { offsetStyle } = useOffset({
  offset: () => props.offset,
  defaultOffset: NOTIFICATION_DEFAULT_OFFSET,
  placement: () => verticalPosition.value,
  zIndex: () => props.zIndex,
})
const notificationStyle = computed(() => ({
  ...offsetStyle.value,
  [horizontalPosition.value]: `${NOTIFICATION_HORIZONTAL_OFFSET}px`,
}))

function clearTimer() {
  timer.clear()
}

function startTimer() {
  clearTimer()
  const duration = Math.max(toNumber(props.duration) || 0, 0)
  if (duration === 0) return

  timer.start(close, duration)
}

function close() {
  if (!visible.value) return

  visible.value = false
  clearTimer()
  emits('close')
}

function handleClick() {
  emits('click')
}

function handleAfterLeave() {
  emits('destroy')
}

onMounted(() => {
  visible.value = true
  startTimer()
})

defineExpose<NotificationExposed>({
  visible,
  close,
})
</script>

<template>
  <transition name="moe-notification-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      :id="id"
      class="moe-notification"
      :class="[
        `moe-notification--${normalizedType}`,
        `is-${position}`,
        `is-${horizontalPosition}`,
        {
          'is-closable': showClose,
          'is-clickable': Boolean(onClick),
        },
      ]"
      :style="notificationStyle"
      role="alert"
      @click="handleClick"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <span v-if="hasIcon" class="moe-notification__icon">
        <component :is="iconComponent" v-if="typeof iconComponent !== 'string'" />
        <moe-icon v-else :icon="iconComponent" size="xl" />
      </span>

      <div class="moe-notification__body">
        <div v-if="title" class="moe-notification__title">
          {{ title }}
        </div>
        <div v-if="messageRenderer || message" class="moe-notification__message">
          <component :is="messageRenderer" v-if="messageRenderer" />
          <template v-else>{{ message }}</template>
        </div>
      </div>

      <button
        v-if="showClose"
        class="moe-notification__close"
        type="button"
        aria-label="关闭通知"
        @click.stop="close"
      >
        <moe-icon icon="mingcute:close-line" size="md" />
      </button>
    </div>
  </transition>
</template>
