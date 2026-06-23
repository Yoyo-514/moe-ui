<script setup lang="ts">
import { computed, ref } from 'vue'

import { useTimeout, useLocale } from '@moe-ui/hooks'

import { addUnit } from '@moe-ui/utils'

import MoeButton from '../../Button/src/Button.vue'
import MoeIcon from '../../Icon/src/Icon.vue'
import MoeTooltip from '../../Tooltip/src/Tooltip.vue'

import type { PopconfirmEmits, PopconfirmProps } from './types'
import type { TooltipInstance } from '../../Tooltip/src/types'

defineOptions({
  name: 'MoePopconfirm',
})

const props = withDefaults(defineProps<PopconfirmProps>(), {
  title: '',
  confirmButtonText: undefined,
  cancelButtonText: undefined,
  confirmButtonType: 'primary',
  cancelButtonType: 'text',
  icon: 'mingcute:question-line',
  iconColor: 'var(--moe-color-warning)',
  hideIcon: false,
  hideAfter: 200,
  width: '150px',
})

const emits = defineEmits<PopconfirmEmits>()
const { t } = useLocale()
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
const confirmButtonText = computed(
  () => props.confirmButtonText ?? t('popconfirm.confirmButtonText')
)
const cancelButtonText = computed(() => props.cancelButtonText ?? t('popconfirm.cancelButtonText'))

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
