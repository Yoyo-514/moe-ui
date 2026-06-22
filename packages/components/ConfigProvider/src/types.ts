import type { ButtonSize } from '../../Button/src/types'
import type { Language } from '@moe-ui/locale'
import type { InjectionKey, Ref } from 'vue'

export interface ConfigProviderContext {
  namespace?: string
  size?: ButtonSize
  zIndex?: number
  locale?: Language
}

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderContext>> = Symbol(
  'configProviderContextKey'
)
