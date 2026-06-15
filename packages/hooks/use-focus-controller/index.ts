import { nextTick, ref, type Ref } from 'vue'

export type FocusTarget = HTMLInputElement | HTMLTextAreaElement

export interface UseFocusControllerOptions {
  target: Ref<FocusTarget | undefined>
  beforeFocus?: () => boolean
  beforeBlur?: () => boolean
}

export interface UseFocusControllerReturn {
  isFocused: Ref<boolean>
  focus: () => Promise<void>
  blur: () => void
  handleFocus: () => void
  handleBlur: () => void
}

export function useFocusController(options: UseFocusControllerOptions): UseFocusControllerReturn {
  const isFocused = ref(false)

  const focus = async () => {
    if (options.beforeFocus?.() === false) return

    await nextTick()
    options.target.value?.focus()
  }

  const blur = () => {
    if (options.beforeBlur?.() === false) return

    options.target.value?.blur()
  }

  const handleFocus = () => {
    isFocused.value = true
  }

  const handleBlur = () => {
    isFocused.value = false
  }

  return {
    isFocused,
    focus,
    blur,
    handleFocus,
    handleBlur,
  }
}
