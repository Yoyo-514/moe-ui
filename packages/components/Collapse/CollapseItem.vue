<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import { COLLAPSE_CTX_KEY } from './constants'
import { collapseTransitionEvents } from './transition-event'
import type { CollapseItemProps } from './types'

defineOptions({ name: 'MoeCollapseItem' })

const props = withDefaults(defineProps<CollapseItemProps>(), {
  title: '',
  disabled: false,
})

const collapseContext = inject(COLLAPSE_CTX_KEY)
const headerId = useId()
const contentId = useId()

const isActive = computed(() => collapseContext?.activeNames.value.includes(props.name) ?? false)

function handleHeaderClick() {
  if (props.disabled) return
  collapseContext?.handleItemClick(props.name)
}

function handleHeaderKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  handleHeaderClick()
}
</script>

<template>
  <div
    class="moe-collapse-item"
    :class="{
      'is-active': isActive,
      'is-disabled': disabled,
    }"
  >
    <div
      :id="headerId"
      class="moe-collapse-item__header"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="isActive"
      :aria-disabled="disabled"
      :aria-controls="contentId"
      @click="handleHeaderClick"
      @keydown="handleHeaderKeydown"
    >
      <span class="moe-collapse-item__title">
        <slot name="title">{{ title }}</slot>
      </span>
      <span class="moe-collapse-item__arrow" aria-hidden="true"></span>
    </div>

    <Transition name="moe-collapse-transition" v-on="collapseTransitionEvents">
      <div
        v-show="isActive"
        :id="contentId"
        class="moe-collapse-item__wrap"
        role="region"
        :aria-labelledby="headerId"
      >
        <div class="moe-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>
