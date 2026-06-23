import { inject, nextTick } from 'vue'

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
