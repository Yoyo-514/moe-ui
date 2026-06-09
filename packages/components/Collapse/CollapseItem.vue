<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import { useDisabledStyle } from '@moe-ui/hooks'
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
const { ariaDisabled, disabledClass, disabledTabIndex, isDisabled } = useDisabledStyle(
  () => props.disabled
)

function handleHeaderClick() {
  if (isDisabled.value) return
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
    :class="[
      {
        'is-active': isActive,
      },
      disabledClass,
    ]"
  >
    <div
      :id="headerId"
      class="moe-collapse-item__header"
      role="button"
      :tabindex="disabledTabIndex"
      :aria-expanded="isActive"
      :aria-disabled="ariaDisabled"
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
