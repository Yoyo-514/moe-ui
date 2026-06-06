<script setup lang="ts">
import { computed, onUnmounted, ref, watch, watchEffect, type Ref } from 'vue'
import { bind, debounce, type DebouncedFunc } from 'lodash-es'
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

const triggerStrategyMap: Map<TooltipTrigger, () => void> = new Map()
triggerStrategyMap.set('hover', () => {
  events.value['mouseenter'] = openFinal
  outerEvents.value['mouseleave'] = closeFinal
  dropdownEvents.value['mouseenter'] = openFinal
})
triggerStrategyMap.set('click', () => {
  events.value['click'] = togglePopper
})
let openDebounce: DebouncedFunc<() => void> | void
let closeDebounce: DebouncedFunc<() => void> | void

function openFinal() {
  closeDebounce?.cancel()
  openDebounce?.()
}

function closeFinal() {
  openDebounce?.cancel()
  closeDebounce?.()
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
function destroyPopperInstance() {
  popperInstance?.destroy()
  popperInstance = null
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
  openDebounce?.cancel()
  setVisible(false)
}

watch(
  shouldShowPopper,
  (val) => {
    if (!val) return

    popperInstance = createPopper(triggerNode.value!, popperNode.value!, popperOptions.value)
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
    openDebounce?.cancel()
    closeDebounce?.cancel()
    setVisible(false)
    resetEvents()
  }
)

watchEffect(() => {
  openDebounce?.cancel()
  closeDebounce?.cancel()
  openDebounce = debounce(bind(setVisible, null, true), openDelay.value)
  closeDebounce = debounce(bind(setVisible, null, false), closeDelay.value)
})

onUnmounted(() => {
  openDebounce?.cancel()
  closeDebounce?.cancel()
  destroyPopperInstance()
})

defineExpose<TooltipInstance>({
  show,
  hide,
})
</script>

<template>
  <div class="moe-tooltip" v-on="outerEvents">
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
