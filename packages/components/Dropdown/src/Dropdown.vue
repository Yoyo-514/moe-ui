<script setup lang="ts">
import { computed, provide, ref, useId } from 'vue'
import type { PropType } from 'vue'
import { omit } from 'lodash-es'
import { useDisabledStyle, useTimeout } from '@moe-ui/hooks'
import MoeButton from '../../Button/src/Button.vue'
import MoeButtonGroup from '../../Button/src/ButtonGroup.vue'
import MoeIcon from '../../Icon/src/Icon.vue'
import MoeTooltip from '../../Tooltip/src/Tooltip.vue'
import type { TooltipInstance } from '../../Tooltip/src/types'
import { DROPDOWN_CTX_KEY } from './constants'
import DropdownItem from './DropdownItem.vue'
import DropdownMenu from './DropdownMenu.vue'
import type { DropdownEmits, DropdownInstance, DropdownItemProps, DropdownProps } from './types'

defineOptions({
  name: 'MoeDropdown',
  inheritAttrs: false,
})

const props = defineProps({
  type: String as PropType<DropdownProps['type']>,
  size: String as PropType<DropdownProps['size']>,
  splitButton: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  trigger: {
    type: [String, Array] as PropType<DropdownProps['trigger']>,
    default: 'hover',
  },
  placement: {
    type: String as PropType<DropdownProps['placement']>,
    default: 'bottom',
  },
  hideOnClick: {
    type: Boolean,
    default: true,
  },
  showAfter: {
    type: Number,
    default: 150,
  },
  hideAfter: {
    type: Number,
    default: 150,
  },
  effect: {
    type: String as PropType<DropdownProps['effect']>,
    default: 'light',
  },
  visible: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  transition: {
    type: String,
    default: 'moe-dropdown-fade',
  },
  offset: {
    type: Number,
    default: 12,
  },
  items: {
    type: Array as PropType<DropdownItemProps[]>,
    default: () => [],
  },
})

const emits = defineEmits<DropdownEmits>()
const slots = defineSlots<{
  default?: () => unknown
  dropdown?: () => unknown
}>()

const dropdownId = `moe-dropdown-${useId()}`
const tooltipRef = ref<TooltipInstance>()
const innerVisible = ref(false)
const hideTimer = useTimeout()
const { ariaDisabled, disabledClass, disabledTabIndex, isDisabled } = useDisabledStyle(
  () => props.disabled
)

const currentVisible = computed(() =>
  props.visible === undefined ? innerVisible.value : props.visible === true
)

const tooltipProps = computed(() => ({
  ...omit(props, [
    'type',
    'size',
    'items',
    'hideOnClick',
    'splitButton',
    'content',
    'popperOptions',
  ]),
  visible: currentVisible.value,
}))
const hasDropdownSlot = computed(() => Boolean(slots.dropdown))
const hasItems = computed(() => props.items.length > 0)

function setVisible(value: boolean) {
  if (isDisabled.value && value) return

  if (props.visible === undefined) {
    innerVisible.value = value
  }

  emits('update:visible', value)
}

function handleVisibleChange(value: boolean) {
  setVisible(value)
}

function open() {
  hideTimer.clear()
  setVisible(true)
}

function close() {
  hideTimer.clear()
  hideTimer.start(() => {
    setVisible(false)
    tooltipRef.value?.hide()
  }, props.hideAfter)
}

function handleItemClick(item: DropdownItemProps) {
  if (item.disabled) return

  if (item.command !== undefined) {
    emits('command', item.command)
  }

  if (props.hideOnClick) {
    close()
  }
}

function handleMainButtonClick(event: MouseEvent) {
  if (isDisabled.value) return

  emits('click', event)
}

provide(DROPDOWN_CTX_KEY, {
  handleItemClick,
  size: computed(() => props.size),
})

defineExpose<DropdownInstance>({
  open,
  close,
})
</script>

<template>
  <div :id="dropdownId" class="moe-dropdown" :class="disabledClass" :aria-disabled="ariaDisabled">
    <moe-button-group
      v-if="splitButton"
      class="moe-dropdown__split-button"
      :type="type"
      :size="size"
      :disabled="isDisabled"
    >
      <moe-button @click.stop="handleMainButtonClick">
        <slot></slot>
      </moe-button>

      <moe-tooltip
        ref="tooltipRef"
        content=" "
        v-bind="tooltipProps"
        @update:visible="handleVisibleChange"
      >
        <template #default>
          <moe-button class="moe-dropdown__caret-button" :tabindex="disabledTabIndex">
            <moe-icon icon="mingcute:down-line" size="md" />
          </moe-button>
        </template>

        <template #content>
          <slot v-if="hasDropdownSlot" name="dropdown"></slot>
          <dropdown-menu v-else-if="hasItems">
            <dropdown-item
              v-for="(item, index) in items"
              :key="index"
              :command="item.command"
              :icon="item.icon"
              :disabled="item.disabled"
              :divided="item.divided"
            />
          </dropdown-menu>
        </template>
      </moe-tooltip>
    </moe-button-group>

    <moe-tooltip
      v-else
      ref="tooltipRef"
      content=" "
      v-bind="tooltipProps"
      @update:visible="handleVisibleChange"
    >
      <template #default>
        <slot></slot>
      </template>

      <template #content>
        <slot v-if="hasDropdownSlot" name="dropdown"></slot>
        <dropdown-menu v-else-if="hasItems">
          <dropdown-item
            v-for="(item, index) in items"
            :key="index"
            :command="item.command"
            :icon="item.icon"
            :disabled="item.disabled"
            :divided="item.divided"
          />
        </dropdown-menu>
      </template>
    </moe-tooltip>
  </div>
</template>
