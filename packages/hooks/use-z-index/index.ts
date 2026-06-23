import type { InjectionKey, Ref } from 'vue'
import { computed, getCurrentInstance, inject, unref } from 'vue'

import { toNumber } from 'lodash-es'

export interface ZIndexContext {
  zIndex: Ref<number | undefined>
}

export const Z_INDEX_INJECTION_KEY: InjectionKey<ZIndexContext> = Symbol('zIndex')

const defaultSeed = 2000
let seed = defaultSeed

/**
 * Returns a global zIndex value from ConfigProvider if available (setup only).
 */
export const useGlobalZIndex = () => {
  const instance = getCurrentInstance()
  const injected = instance ? inject(Z_INDEX_INJECTION_KEY, undefined) : undefined

  return computed<number | undefined>(() => unref(injected?.zIndex))
}

export function useZIndex(initialValue?: number) {
  const globalZIndex = useGlobalZIndex()

  const initial = initialValue ?? globalZIndex.value ?? defaultSeed
  seed = Math.max(toNumber(initial) || seed, seed)

  const currentZIndex = () => seed
  const nextZIndex = () => {
    seed += 1
    return seed
  }

  return {
    currentZIndex,
    nextZIndex,
  }
}

export function resetZIndex(value = defaultSeed) {
  seed = value
}
