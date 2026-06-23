<script setup lang="ts">
import { computed, onMounted, ref, isVNode } from 'vue'

import { isFunction, toNumber } from 'lodash-es'

import { useOffset, useTimeout } from '@moe-ui/hooks'

import {
  MESSAGE_DEFAULT_DURATION,
  MESSAGE_DEFAULT_OFFSET,
  MESSAGE_HEIGHT,
  MESSAGE_ICON_MAP,
} from './constants'
import MoeIcon from '../../Icon/src/Icon.vue'

import type { MessageEmits, MessageExposed, MessageProps, MessageType } from './types'

defineOptions({
  name: 'MoeMessage',
})

const props = withDefaults(defineProps<MessageProps>(), {
  message: '',
  duration: MESSAGE_DEFAULT_DURATION,
  showClose: false,
  offset: MESSAGE_DEFAULT_OFFSET,
  placement: 'top',
  type: 'info',
})

const emits = defineEmits<MessageEmits>()
const visible = ref(false)
const timer = useTimeout()
const { offsetStyle: placementStyle, endOffset: bottom } = useOffset({
  offset: () => props.offset,
  defaultOffset: MESSAGE_DEFAULT_OFFSET,
  placement: () => props.placement,
  zIndex: () => props.zIndex,
  size: MESSAGE_HEIGHT,
})

const normalizedType = computed<MessageType>(() => (props.type === 'error' ? 'danger' : props.type))
const iconName = computed(() => MESSAGE_ICON_MAP[normalizedType.value])
const isVNodeMessage = computed(() => isVNode(props.message) || isFunction(props.message))
const messageRenderer = computed(() => {
  if (isFunction(props.message)) return props.message
  if (isVNodeMessage.value) return () => props.message
  return undefined
})

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

function handleAfterLeave() {
  emits('destroy')
}

onMounted(() => {
  visible.value = true
  startTimer()
})

defineExpose<MessageExposed>({
  visible,
  bottom,
  close,
})
</script>

<template>
  <transition name="moe-message-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      :id="id"
      class="moe-message"
      :class="[`moe-message--${normalizedType}`, `is-${placement}`, { 'is-closable': showClose }]"
      :style="placementStyle"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <moe-icon class="moe-message__icon" :icon="iconName" size="md" />
      <span class="moe-message__content">
        <component :is="messageRenderer" v-if="messageRenderer" />
        <template v-else>{{ message }}</template>
      </span>
      <button
        v-if="showClose"
        class="moe-message__close"
        type="button"
        aria-label="关闭消息"
        @click="close"
      >
        <moe-icon icon="mingcute:close-line" size="md" />
      </button>
    </div>
  </transition>
</template>
