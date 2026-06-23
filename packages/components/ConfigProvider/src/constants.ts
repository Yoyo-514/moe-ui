import type { InjectionKey, Ref } from 'vue'

import type { ConfigProviderProps } from './types'

export type ConfigProviderContext = Partial<ConfigProviderProps>

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderContext>> = Symbol(
  'configProviderContextKey'
)
