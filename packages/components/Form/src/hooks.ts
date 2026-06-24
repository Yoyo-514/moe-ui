import { computed, type ComputedRef } from 'vue'

import { useGlobalSize, useProp } from '@moe-ui/hooks'

import { FORM_DEFAULT_SIZE } from './constants'
import { useFormContext, useFormItem } from './use-form-item'

import type { FormSize } from './types'

export function useFormDisabled(): ComputedRef<boolean> {
  const disabled = useProp<boolean>('disabled')
  const form = useFormContext()

  return computed(() => disabled.value ?? form?.props.disabled ?? false)
}

export function useFormSize(defaultSize: FormSize = FORM_DEFAULT_SIZE): ComputedRef<FormSize> {
  const size = useProp<FormSize>('size')
  const form = useFormContext()
  const formItem = useFormItem()
  const globalSize = useGlobalSize()

  return computed(
    () => size.value ?? formItem?.size?.value ?? form?.props.size ?? globalSize.value ?? defaultSize
  )
}
