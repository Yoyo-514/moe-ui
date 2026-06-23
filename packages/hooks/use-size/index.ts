import type { InjectionKey, PropType, Ref } from 'vue'
import { computed, inject, unref } from 'vue'

import type { ComponentSize } from '@moe-ui/constants'
import { componentSizes } from '@moe-ui/constants'

export const useSizeProp = {
  type: String as PropType<ComponentSize>,
  required: false,
  validator: (value: unknown): value is ComponentSize => {
    return componentSizes.includes(value as ComponentSize)
  },
}

export const useSizeProps = {
  size: useSizeProp,
}

export interface SizeContext {
  size: Ref<ComponentSize>
}

export const SIZE_INJECTION_KEY: InjectionKey<SizeContext> = Symbol('size')

export const useGlobalSize = () => {
  const injectedSize = inject(SIZE_INJECTION_KEY, {} as SizeContext)

  return computed<ComponentSize>(() => {
    return unref(injectedSize.size) || ''
  })
}
