<script setup lang="ts">
import { computed, isVNode, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { isFunction } from 'lodash-es'
import MoeButton from '../Button/Button.vue'
import MoeIcon from '../Icon/Icon.vue'
import MoeInput from '../Input/Input.vue'
import MoeOverlay from '../Overlay'
import { MESSAGE_BOX_ICON_MAP } from './constants'
import type {
  MessageBoxAction,
  MessageBoxEmits,
  MessageBoxExposed,
  MessageBoxProps,
  MessageBoxState,
} from './types'
import type { InputInstance } from '../Input/types'

const props = defineProps<MessageBoxProps>()

const emits = defineEmits<MessageBoxEmits>()

const visible = ref(false)
const inputValue = ref(props.inputValue)
const validateError = ref(false)
const inputErrorMessage = ref(props.inputErrorMessage)
const isValidating = ref(false)
const isClosing = ref(false)
const rootRef = ref<HTMLElement>()
const inputRef = ref<InputInstance>()
let previousBodyOverflow = ''

const titleId = useId()
const normalizedAction = (action: MessageBoxAction) =>
  action === 'close' && !props.distinguishCancelAndClose ? 'cancel' : action
const hasTypeIcon = computed(() => props.type !== '' && props.type in MESSAGE_BOX_ICON_MAP)
const iconComponent = computed(() => {
  if (props.icon !== undefined && props.icon !== '') return props.icon
  if (hasTypeIcon.value)
    return MESSAGE_BOX_ICON_MAP[props.type as keyof typeof MESSAGE_BOX_ICON_MAP]
  return ''
})
const hasIcon = computed(() => Boolean(iconComponent.value))
const isVNodeMessage = computed(() => isVNode(props.message) || isFunction(props.message))
const messageRenderer = computed(() => {
  if (isFunction(props.message)) return props.message
  if (isVNodeMessage.value) return () => props.message
  return undefined
})
const boxClasses = computed(() => [
  `moe-message-box--${props.type || 'default'}`,
  props.customClass,
  {
    'is-center': props.center,
    'is-round-button': props.roundButton,
    'is-input': props.showInput,
  },
])
const overlayClass = computed(() => ['moe-message-box__wrapper', props.modalClass])

function clearInputError() {
  validateError.value = false
  inputErrorMessage.value = props.inputErrorMessage
}

async function validateInput() {
  if (!props.showInput) return true

  const value = inputValue.value
  if (props.inputPattern && !props.inputPattern.test(value)) {
    validateError.value = true
    inputErrorMessage.value = props.inputErrorMessage
    return false
  }

  if (!props.inputValidator) return true

  try {
    isValidating.value = true
    const result = await props.inputValidator(value)

    if (result === true) return true

    validateError.value = true
    inputErrorMessage.value = typeof result === 'string' ? result : props.inputErrorMessage
    return false
  } catch (error) {
    validateError.value = true
    inputErrorMessage.value = error instanceof Error ? error.message : props.inputErrorMessage
    return false
  } finally {
    isValidating.value = false
  }
}

function doClose(action: MessageBoxAction) {
  if (isClosing.value) return

  isClosing.value = true
  visible.value = false
  emits('action', action, inputValue.value)
}

function getState(): MessageBoxState {
  return {
    get visible() {
      return visible.value
    },
    get inputValue() {
      return inputValue.value
    },
    get validateError() {
      return validateError.value
    },
    get inputErrorMessage() {
      return inputErrorMessage.value
    },
    confirm,
    cancel,
    close,
  }
}

async function handleAction(action: MessageBoxAction) {
  if (isClosing.value || isValidating.value) return

  const nextAction = normalizedAction(action)
  if (nextAction === 'confirm') {
    const valid = await validateInput()
    if (!valid) return
  }

  const done = () => doClose(nextAction)

  if (props.beforeClose) {
    props.beforeClose(nextAction, getState(), done)
    return
  }

  done()
}

function confirm() {
  return handleAction('confirm')
}

function cancel() {
  handleAction('cancel')
}

function close() {
  handleAction('close')
}

function handleWrapperClick() {
  if (!props.modal || !props.closeOnClickModal) return

  handleAction('close')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !props.closeOnPressEscape) return

  handleAction('close')
}

function handleHashChange() {
  if (!props.closeOnHashChange) return

  handleAction('close')
}

function focusFirstElement() {
  if (!props.autofocus) {
    rootRef.value?.focus()
    return
  }

  if (props.showInput) {
    inputRef.value?.focus()
    return
  }

  const confirmElement = rootRef.value?.querySelector<HTMLElement>(
    '.moe-message-box__footer .moe-button:last-child'
  )

  if (confirmElement) {
    confirmElement.focus()
    return
  }

  rootRef.value?.focus()
}

function handleEnterKeydown(event: KeyboardEvent) {
  if (event.target !== rootRef.value) return

  event.preventDefault()
  handleAction('confirm')
}

function handleAfterLeave() {
  emits('destroy')
}

function lockBodyScroll() {
  if (!props.modal || !props.lockScroll || typeof document === 'undefined') return

  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

function restoreBodyScroll() {
  if (!props.modal || !props.lockScroll || typeof document === 'undefined') return

  document.body.style.overflow = previousBodyOverflow
}

onMounted(async () => {
  visible.value = true
  lockBodyScroll()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('hashchange', handleHashChange)

  await nextTick()
  focusFirstElement()
})

onBeforeUnmount(() => {
  restoreBodyScroll()
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('hashchange', handleHashChange)
})

defineExpose<MessageBoxExposed>({
  get visible() {
    return visible.value
  },
  get inputValue() {
    return inputValue.value
  },
  get validateError() {
    return validateError.value
  },
  get inputErrorMessage() {
    return inputErrorMessage.value
  },
  confirm,
  cancel,
  close,
})
</script>

<template>
  <moe-overlay
    :visible="visible"
    :mask="modal"
    :z-index="zIndex"
    :overlay-class="overlayClass"
    @click="handleWrapperClick"
    @after-leave="handleAfterLeave"
  >
    <div
      :id="id"
      ref="rootRef"
      class="moe-message-box"
      :class="boxClasses"
      :style="customStyle"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      :aria-labelledby="title ? titleId : undefined"
      @click.stop
      @keydown.enter="handleEnterKeydown"
    >
      <header class="moe-message-box__header">
        <span v-if="hasIcon" class="moe-message-box__status-icon">
          <component :is="iconComponent" v-if="typeof iconComponent !== 'string'" />
          <moe-icon v-else :icon="iconComponent" size="xl" />
        </span>
        <span v-if="title" :id="titleId" class="moe-message-box__title">
          {{ title }}
        </span>
        <button
          v-if="showClose"
          class="moe-message-box__close"
          type="button"
          aria-label="关闭弹框"
          @click="close"
        >
          <component :is="closeIcon" v-if="typeof closeIcon !== 'string'" />
          <moe-icon v-else :icon="closeIcon" size="md" />
        </button>
      </header>

      <section class="moe-message-box__content">
        <div v-if="messageRenderer || message" class="moe-message-box__message">
          <component :is="messageRenderer" v-if="messageRenderer" />
          <template v-else>{{ message }}</template>
        </div>

        <div v-if="showInput" class="moe-message-box__input-wrap">
          <moe-input
            ref="inputRef"
            v-model="inputValue"
            class="moe-message-box__input"
            :type="inputType"
            :placeholder="inputPlaceholder"
            :aria-invalid="validateError || undefined"
            @input="clearInputError"
          />
          <div v-if="validateError" class="moe-message-box__input-error">
            {{ inputErrorMessage }}
          </div>
        </div>
      </section>

      <footer class="moe-message-box__footer">
        <moe-button
          v-if="showCancelButton"
          :type="cancelButtonType || undefined"
          :size="buttonSize"
          :round="roundButton"
          @click="cancel"
          @keydown.enter.prevent="cancel"
        >
          {{ cancelButtonText }}
        </moe-button>
        <moe-button
          v-if="showConfirmButton"
          :type="confirmButtonType || undefined"
          :size="buttonSize"
          :round="roundButton"
          :loading="isValidating"
          @click="confirm"
          @keydown.enter.prevent="confirm"
        >
          {{ confirmButtonText }}
        </moe-button>
      </footer>
    </div>
  </moe-overlay>
</template>
