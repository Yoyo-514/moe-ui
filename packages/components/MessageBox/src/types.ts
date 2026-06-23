import type { App, Component, ComponentInternalInstance, CSSProperties, VNode } from 'vue'

import type { ButtonSize, ButtonType } from '../../Button/src/types'

export const messageBoxTypes = ['', 'primary', 'success', 'warning', 'info', 'danger'] as const
export const messageBoxActions = ['confirm', 'cancel', 'close'] as const

export type MessageBoxType = (typeof messageBoxTypes)[number]
export type MessageBoxAction = (typeof messageBoxActions)[number]
export type MessageBoxContent = string | VNode | (() => VNode)
export type MessageBoxIcon = string | Component
export type MessageBoxButtonType = ButtonType | ''
export type MessageBoxInputValidator = (
  value: string
) => boolean | string | Promise<boolean | string>

export interface MessageBoxState {
  visible: boolean
  inputValue: string
  validateError: boolean
  inputErrorMessage: string
  confirm(): Promise<void> | void
  cancel(): void
  close(): void
}

export type MessageBoxCallback =
  | ((action: MessageBoxAction) => void)
  | ((value: string, action: MessageBoxAction) => void)

export interface MessageBoxOptions {
  title?: string
  message?: MessageBoxContent
  type?: MessageBoxType
  icon?: MessageBoxIcon
  closeIcon?: MessageBoxIcon
  modal?: boolean
  modalClass?: string
  callback?: MessageBoxCallback | null
  showClose?: boolean
  beforeClose?:
    | ((action: MessageBoxAction, instance: MessageBoxState, done: () => void) => void)
    | null
  distinguishCancelAndClose?: boolean
  showCancelButton?: boolean
  showConfirmButton?: boolean
  cancelButtonText?: string
  confirmButtonText?: string
  cancelButtonType?: MessageBoxButtonType
  confirmButtonType?: MessageBoxButtonType
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  closeOnHashChange?: boolean
  showInput?: boolean
  inputPlaceholder?: string
  inputType?: string
  inputValue?: string
  inputValidator?: MessageBoxInputValidator
  inputPattern?: RegExp
  inputErrorMessage?: string
  center?: boolean
  roundButton?: boolean
  buttonSize?: ButtonSize
  customClass?: string
  customStyle?: CSSProperties
  autofocus?: boolean
  lockScroll?: boolean
  zIndex?: number
}

export interface MessageBoxProps extends Required<
  Omit<
    MessageBoxOptions,
    | 'message'
    | 'icon'
    | 'closeIcon'
    | 'callback'
    | 'beforeClose'
    | 'inputValidator'
    | 'inputPattern'
    | 'zIndex'
  >
> {
  id: string
  message?: MessageBoxContent
  icon?: MessageBoxIcon
  closeIcon: MessageBoxIcon
  callback?: MessageBoxCallback | null
  beforeClose?: MessageBoxOptions['beforeClose'] | null
  inputValidator?: MessageBoxInputValidator
  inputPattern?: RegExp
  zIndex: number
}

export type MessageBoxParams = MessageBoxContent | MessageBoxOptions
export type MessageBoxData = MessageBoxAction | { action: 'confirm'; value: string }

export interface MessageBoxEmits {
  (e: 'action', action: MessageBoxAction, value: string): void
  (e: 'destroy'): void
}

export type MessageBoxExposed = MessageBoxState

export interface MessageBoxContext {
  id: string
  props: MessageBoxProps
  vnode: VNode
  vm: ComponentInternalInstance
  container: HTMLDivElement
}

export interface MessageBoxShortcutMethod {
  (message: MessageBoxContent, options?: MessageBoxOptions): Promise<MessageBoxData>
  (message: MessageBoxContent, title: string, options?: MessageBoxOptions): Promise<MessageBoxData>
}

export interface MessageBox {
  (options?: MessageBoxParams): Promise<MessageBoxData>
  alert: MessageBoxShortcutMethod
  confirm: MessageBoxShortcutMethod
  prompt: MessageBoxShortcutMethod
  closeAll(): void
  install(app: App): void
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    $messageBox: MessageBox
    $msgbox: MessageBox
    $alert: MessageBoxShortcutMethod
    $confirm: MessageBoxShortcutMethod
    $prompt: MessageBoxShortcutMethod
  }
}
