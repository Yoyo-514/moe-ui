import type { MessageBoxOptions, MessageBoxType } from './types'

export const MESSAGE_BOX_DEFAULT_Z_INDEX = 3000
export const MESSAGE_BOX_CLOSE_ICON = 'mingcute:close-line'

export const MESSAGE_BOX_ICON_MAP: Record<Exclude<MessageBoxType, ''>, string> = {
  primary: 'mingcute:information-line',
  info: 'mingcute:information-line',
  success: 'mingcute:check-circle-line',
  warning: 'mingcute:warning-line',
  danger: 'mingcute:close-circle-line',
}

export const MESSAGE_BOX_DEFAULT_OPTIONS = {
  title: '',
  message: '',
  type: '',
  modal: true,
  modalClass: '',
  callback: null,
  showClose: true,
  beforeClose: null,
  distinguishCancelAndClose: false,
  showCancelButton: false,
  showConfirmButton: true,
  cancelButtonText: '取消',
  confirmButtonText: '确认',
  cancelButtonType: '',
  confirmButtonType: 'primary',
  closeOnClickModal: true,
  closeOnPressEscape: true,
  closeOnHashChange: true,
  showInput: false,
  inputPlaceholder: '',
  inputType: 'text',
  inputValue: '',
  inputErrorMessage: '输入内容不合法',
  center: false,
  roundButton: false,
  buttonSize: 'default',
  customClass: '',
  customStyle: {},
  autofocus: true,
  lockScroll: true,
} satisfies Omit<
  MessageBoxOptions,
  'icon' | 'closeIcon' | 'inputValidator' | 'inputPattern' | 'zIndex'
>
