import type { ComputedRef } from 'vue'
import { computed, getCurrentInstance } from 'vue'

export const useProp = <T>(name: string): ComputedRef<T | undefined> => {
  const instance = getCurrentInstance()

  if (!instance) {
    throw new Error('useProp must be used within a component')
  }

  return computed(() => (instance?.proxy?.$props as any)?.[name])
}
