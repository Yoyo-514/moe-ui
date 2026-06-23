import type { ComputedRef, InjectionKey } from 'vue'

import type { ButtonSize, ButtonType } from './types'

export interface ButtonGroupContext {
  type: ComputedRef<ButtonType | undefined>
  size: ComputedRef<ButtonSize | undefined>
  disabled: ComputedRef<boolean | undefined>
}

export const BUTTON_GROUP_CTX_KEY: InjectionKey<ButtonGroupContext> = Symbol('BUTTON_GROUP_CTX_KEY')
