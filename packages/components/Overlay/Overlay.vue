<script setup lang="ts">
import { computed } from 'vue'
import type { OverlayEmits, OverlayProps, OverlayStyle } from './types'

const props = withDefaults(defineProps<OverlayProps>(), {
  visible: false,
  mask: true,
  overlayClass: '',
})

const emits = defineEmits<OverlayEmits>()

const overlayClasses = computed(() => [
  props.overlayClass,
  {
    'is-mask': props.mask,
    'is-no-mask': !props.mask,
  },
])

const getOverlayStyle = (zIndex?: number): OverlayStyle => ({
  zIndex,
})
</script>

<template>
  <transition name="moe-overlay-fade" @after-leave="emits('after-leave')">
    <div
      v-show="visible"
      class="moe-overlay"
      :class="overlayClasses"
      :style="getOverlayStyle(zIndex)"
      @click="emits('click', $event)"
    >
      <slot></slot>
    </div>
  </transition>
</template>
