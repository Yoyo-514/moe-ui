<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { useClickOutside, useTimeout, useZIndex } from '@moe-ui/hooks'
import { createPopper, type Instance } from '@popperjs/core'

import type { TooltipEmits, TooltipInstance, TooltipProps, TooltipTrigger } from './types'

defineOptions({
  name: 'MoeTooltip',
})

const props = withDefaults(defineProps<TooltipProps>(), {
  content: '',
  effect: 'dark',
  placement: 'bottom',
  trigger: 'hover',
  visible: undefined,
  offset: 12,
  showAfter: 0,
  hideAfter: 200,
  transition: 'fade',
  popperOptions: () => ({}),
})

const emits = defineEmits<TooltipEmits>()
const slots = defineSlots<{
  default?: () => unknown
  content?: () => unknown
}>()

const innerVisible = ref(false)
const tooltipNode = ref<HTMLElement>()
const popperZIndex = ref<number>()
const { nextZIndex } = useZIndex()

const events: Ref<Record<string, EventListener>> = ref({})
const outerEvents: Ref<Record<string, EventListener>> = ref({})
const dropdownEvents: Ref<Record<string, EventListener>> = ref({})

const popperNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()

const isControlled = computed(() => props.visible !== undefined)
const visible = computed(() => (isControlled.value ? props.visible === true : innerVisible.value))
const hasContent = computed(() => Boolean(props.content || slots.content))
const shouldShowPopper = computed(() => visible.value && !props.disabled && hasContent.value)

const popperOptions = computed(() => ({
  ...props.popperOptions,
  placement: props.placement,
  modifiers: [
    ...(props.popperOptions?.modifiers ?? []),
    {
      name: 'offset',
      options: {
        offset: [0, props.offset],
      },
    },
  ],
}))

const triggers = computed<TooltipTrigger[]>(() =>
  Array.isArray(props.trigger) ? props.trigger : [props.trigger]
)

const hasTrigger = (trigger: TooltipTrigger) => triggers.value.includes(trigger)

const openDelay = computed(() => (hasTrigger('hover') ? props.showAfter : 0))

const closeDelay = computed(() => (hasTrigger('hover') ? props.hideAfter : 0))

const shouldCloseOnClickOutside = computed(() => shouldShowPopper.value && hasTrigger('click'))

const triggerStrategyMap: Map<TooltipTrigger, () => void> = new Map()
triggerStrategyMap.set('hover', () => {
  events.value['mouseenter'] = openFinal
  outerEvents.value['mouseleave'] = closeFinal
  dropdownEvents.value['mouseenter'] = openFinal
})
triggerStrategyMap.set('click', () => {
  events.value['click'] = togglePopper
})
const openTimer = useTimeout()
const closeTimer = useTimeout()

function openFinal() {
  closeTimer.clear()
  openTimer.start(() => setVisible(true), openDelay.value)
}

function closeFinal() {
  openTimer.clear()
  closeTimer.start(() => setVisible(false), closeDelay.value)
}

function togglePopper() {
  if (shouldShowPopper.value) {
    closeFinal()
  } else {
    openFinal()
  }
}

function setVisible(val: boolean) {
  if (val && (props.disabled || !hasContent.value)) return
  if (visible.value === val) return

  if (!isControlled.value) {
    innerVisible.value = val
  }

  emits('update:visible', val)

  if (val) {
    emits('show')
  } else {
    emits('hide')
  }
}

function attachEvents() {
  if (props.disabled) return
  triggers.value.forEach((trigger) => triggerStrategyMap.get(trigger)?.())
}

let popperInstance: null | Instance = null
let popperInstanceEl: HTMLElement | undefined

function destroyPopperInstance(el?: Element) {
  if (el && popperInstanceEl && el !== popperInstanceEl) return

  popperInstance?.destroy()
  popperInstance = null
  popperInstanceEl = undefined
}

function createPopperInstance() {
  if (!triggerNode.value || !popperNode.value) return

  destroyPopperInstance()

  popperInstanceEl = popperNode.value
  popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
}

function resetEvents() {
  events.value = {}
  outerEvents.value = {}
  dropdownEvents.value = {}

  attachEvents()
}

attachEvents()

const show: TooltipInstance['show'] = openFinal

const hide: TooltipInstance['hide'] = function () {
  openTimer.clear()
  closeTimer.clear()
  setVisible(false)
}

useClickOutside(tooltipNode, hide, {
  enabled: () => shouldCloseOnClickOutside.value,
})

onMounted(() => {
  if (!shouldShowPopper.value) return

  popperZIndex.value = nextZIndex()
  createPopperInstance()
})

watch(
  shouldShowPopper,
  (val) => {
    if (!val) return

    popperZIndex.value = nextZIndex()
    createPopperInstance()
  },
  { flush: 'post' }
)

watch(
  () => [props.placement, props.offset, props.popperOptions],
  () => {
    if (!shouldShowPopper.value) return
    popperInstance?.setOptions(popperOptions.value)
    popperInstance?.update()
  }
)

watch(
  () => props.trigger,
  () => resetEvents()
)

watch(
  () => props.disabled,
  () => {
    openTimer.clear()
    closeTimer.clear()
    setVisible(false)
    resetEvents()
  }
)

onUnmounted(() => {
  destroyPopperInstance()
})

defineExpose<TooltipInstance>({
  show,
  hide,
})
</script>

<template>
  <div ref="tooltipNode" class="moe-tooltip" v-on="outerEvents">
    <div ref="triggerNode" class="moe-tooltip__trigger" v-on="events">
      <slot></slot>
    </div>

    <transition :name="transition" @after-leave="destroyPopperInstance">
      <div
        v-if="shouldShowPopper"
        ref="popperNode"
        class="moe-tooltip__popper"
        :class="`is-${effect}`"
        role="tooltip"
        :style="{ zIndex: popperZIndex }"
        v-on="dropdownEvents"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </transition>
  </div>
</template>
