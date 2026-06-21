<script setup lang="ts">
import { computed, isVNode, ref } from 'vue'
import { LOADING_DEFAULT_SPINNER } from './constants'
import MoeIcon from '../Icon/Icon.vue'
import MoeOverlay from '../Overlay'
import type { LoadingEmits, LoadingExposed, LoadingProps } from './types'

const props = withDefaults(defineProps<LoadingProps>(), {
  visible: true,
  text: '',
  spinner: LOADING_DEFAULT_SPINNER,
  background: '',
  customClass: '',
  fullscreen: false,
})

const emits = defineEmits<LoadingEmits>()
const visible = ref(props.visible)

const overlayClass = computed(() => [
  'moe-loading__overlay',
  props.customClass,
  {
    'is-fullscreen': props.fullscreen,
  },
])
const overlayStyle = computed(() => ({
  backgroundColor: props.background || undefined,
}))
const textRenderer = computed(() => {
  if (Array.isArray(props.text)) return () => props.text
  if (isVNode(props.text)) return () => props.text
  return undefined
})
const hasText = computed(() => Boolean(textRenderer.value || props.text))

function close() {
  if (!visible.value) return

  visible.value = false
}

function handleAfterLeave() {
  emits('destroy')
}

defineExpose<LoadingExposed>({
  close,
})
</script>

<template>
  <moe-overlay
    :visible="visible"
    mask
    :position="fullscreen ? 'fixed' : 'absolute'"
    :z-index="zIndex"
    :overlay-class="overlayClass"
    :overlay-style="overlayStyle"
    @after-leave="handleAfterLeave"
  >
    <div class="moe-loading" role="status" aria-live="polite">
      <moe-icon class="moe-loading__spinner" :icon="spinner" animation="spin" size="xl" />
      <span v-if="hasText" class="moe-loading__text">
        <component :is="textRenderer" v-if="textRenderer" />
        <template v-else>{{ text }}</template>
      </span>
    </div>
  </moe-overlay>
</template>
