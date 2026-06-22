import type { InjectionKey } from 'vue'
import type {
  FormContext,
  FormItemContext,
  FormLabelPosition,
  FormRequireAsteriskPosition,
  FormSize,
} from './types'

export const FORM_CONTEXT_KEY: InjectionKey<FormContext> = Symbol('MoeFormContext')
export const FORM_ITEM_CONTEXT_KEY: InjectionKey<FormItemContext> = Symbol('MoeFormItemContext')

export const FORM_DEFAULT_LABEL_POSITION: FormLabelPosition = 'right'
export const FORM_DEFAULT_REQUIRE_ASTERISK_POSITION: FormRequireAsteriskPosition = 'left'
export const FORM_DEFAULT_SHOW_MESSAGE = true
export const FORM_DEFAULT_INLINE_MESSAGE = false
export const FORM_DEFAULT_SCROLL_TO_ERROR = false
export const FORM_DEFAULT_SIZE: FormSize = 'default'
