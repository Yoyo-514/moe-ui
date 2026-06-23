import type { ComponentSize } from '@moe-ui/constants'

import type { Language } from '@moe-ui/locale'

export interface ConfigProviderProps {
  size?: ComponentSize
  zIndex?: number
  locale?: Language
}
