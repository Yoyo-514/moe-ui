import type { ButtonSize } from '../../Button/src/types'
import type { InjectionKey, Ref } from 'vue'

export interface ConfigProviderContext {
  namespace?: string
  size?: ButtonSize
  zIndex?: number
}

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderContext>> = Symbol(
  'configProviderContextKey'
)
