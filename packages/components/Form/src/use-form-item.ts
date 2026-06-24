import {
  computed,
  inject,
  nextTick,
  onUnmounted,
  ref,
  toValue,
  useId,
  watch,
  type MaybeRefOrGetter,
} from 'vue'

import { FORM_CONTEXT_KEY, FORM_ITEM_CONTEXT_KEY } from './constants'

import type { FormItemContext, FormValidateTrigger } from './types'

export function useFormItem() {
  return inject(FORM_ITEM_CONTEXT_KEY, undefined)
}

export function useFormContext() {
  return inject(FORM_CONTEXT_KEY, undefined)
}

export function useFormItemValidate() {
  const formItem = useFormItem()

  async function validate(trigger: FormValidateTrigger) {
    if (!formItem) return

    await nextTick()
    await formItem.validate(trigger)
  }

  return {
    formItem: formItem as FormItemContext | undefined,
    validate,
  }
}

export interface FormItemInputIdProps {
  id?: string
  label?: unknown
  ariaLabel?: unknown
}

export interface UseFormItemInputIdOptions {
  formItemContext?: FormItemContext
  disableIdGeneration?: MaybeRefOrGetter<boolean | undefined>
  disableIdManagement?: MaybeRefOrGetter<boolean | undefined>
}

export function useFormItemInputId(
  props: FormItemInputIdProps,
  options: UseFormItemInputIdOptions = {}
) {
  const formItemContext = options.formItemContext ?? useFormItem()
  const generatedId = `moe-input-${useId()}`
  const inputId = ref<string>()

  const isLabeledByFormItem = computed(
    () => !props.label && !props.ariaLabel && Boolean(formItemContext?.inputIds.value.length === 1)
  )

  const stop = watch(
    () =>
      [
        props.id,
        toValue(options.disableIdGeneration),
        toValue(options.disableIdManagement),
      ] as const,
    ([id, disableIdGeneration, disableIdManagement]) => {
      const nextId = id ?? (disableIdGeneration ? undefined : generatedId)
      const previousId = inputId.value

      if (previousId === nextId) return

      if (previousId && !disableIdManagement) formItemContext?.removeInputId(previousId)
      if (nextId && !disableIdManagement) formItemContext?.addInputId(nextId)

      inputId.value = nextId
    },
    { immediate: true }
  )

  onUnmounted(() => {
    stop()
    if (inputId.value && !toValue(options.disableIdManagement)) {
      formItemContext?.removeInputId(inputId.value)
    }
  })

  return {
    isLabeledByFormItem,
    inputId,
  }
}
