import type { InjectionKey } from 'vue'
import type { SelectContext, SelectPropsConfig } from './types'

export const SELECT_CTX_KEY: InjectionKey<SelectContext> = Symbol('MoeSelectContext')

export const SELECT_DEFAULT_PROPS: Required<SelectPropsConfig> = {
  value: 'value',
  label: 'label',
  disabled: 'disabled',
}

export const SELECT_EMPTY_VALUES = ['', undefined, null]
export const SELECT_DEFAULT_Z_INDEX = 2000
