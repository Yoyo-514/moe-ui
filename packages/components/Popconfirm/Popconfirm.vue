<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTimeout } from '@moe-ui/hooks'
import { addUnit } from '@moe-ui/utils'

import MoeButton from '../Button/Button.vue'
import MoeIcon from '../Icon/Icon.vue'
import MoeTooltip from '../Tooltip/Tooltip.vue'

import type { TooltipInstance } from '../Tooltip/types'
import type { PopconfirmEmits, PopconfirmProps } from './types'

defineOptions({
  name: 'MoePopconfirm',
})

const props = withDefaults(defineProps<PopconfirmProps>(), {
  title: '',
  confirmButtonText: '确认',
  cancelButtonText: '取消',
  confirmButtonType: 'primary',
  cancelButtonType: 'text',
  icon: 'mingcute:question-line',
  iconColor: 'var(--moe-color-warning)',
  hideIcon: false,
  hideAfter: 200,
  width: '150px',
})

const emits = defineEmits<PopconfirmEmits>()
defineSlots<{
  reference?: () => unknown
  actions?: (props: {
    confirm: (event: MouseEvent) => void
    cancel: (event: MouseEvent) => void
  }) => unknown
}>()

const tooltipRef = ref<TooltipInstance>()
const hideTimer = useTimeout()

const widthStyle = computed(() => addUnit(props.width) || undefined)

function closePopconfirm() {
  hideTimer.clear()
  hideTimer.start(() => {
    tooltipRef.value?.hide()
  }, props.hideAfter)
}

function handleConfirm(event: MouseEvent) {
  emits('confirm', event)
  closePopconfirm()
}

function handleCancel(event: MouseEvent) {
  emits('cancel', event)
  closePopconfirm()
}
</script>

<template>
  <moe-tooltip ref="tooltipRef" trigger="click" effect="light" transition="moe-popconfirm-fade">
    <template #default>
      <slot name="reference"></slot>
    </template>

    <template #content>
      <div class="moe-popconfirm" role="dialog" aria-modal="false" :style="{ width: widthStyle }">
        <div class="moe-popconfirm__main">
          <moe-icon
            v-if="!hideIcon && icon"
            class="moe-popconfirm__icon"
            :icon="icon"
            :color="iconColor"
            size="lg"
          />
          <div v-if="title" class="moe-popconfirm__title">
            {{ title }}
          </div>
        </div>

        <div class="moe-popconfirm__actions">
          <slot name="actions" :confirm="handleConfirm" :cancel="handleCancel">
            <moe-button size="small" :type="cancelButtonType" @click="handleCancel">
              {{ cancelButtonText }}
            </moe-button>
            <moe-button size="small" :type="confirmButtonType" @click="handleConfirm">
              {{ confirmButtonText }}
            </moe-button>
          </slot>
        </div>
      </div>
    </template>
  </moe-tooltip>
</template>
