import type { ComponentInternalInstance, ComputedRef, Ref, VNode } from 'vue'

export const messageTypes = ['primary', 'info', 'success', 'warning', 'danger'] as const

export type MessageType = (typeof messageTypes)[number]
export type MessageAliasType = MessageType | 'error'
export type MessagePlacement = 'top' | 'bottom'
export type MessageContent = string | VNode | (() => VNode)

export interface MessageProps {
  id: string
  message?: MessageContent
  duration?: number
  showClose?: boolean
  offset?: number
  zIndex: number
  placement: MessagePlacement
  type: MessageAliasType
  onClose?: () => void
}

export type MessageOptions = Partial<Omit<MessageProps, 'id'>>
export type MessageParams = string | VNode | MessageOptions

export interface MessageEmits {
  (e: 'close'): void
  (e: 'destroy'): void
}

export interface MessageHandler {
  close(): void
}

export interface MessageExposed {
  visible: Ref<boolean>
  bottom: ComputedRef<number>
  close(): void
}

export interface MessageContext {
  id: string
  props: MessageProps
  vnode: VNode
  handler: MessageHandler
  vm: ComponentInternalInstance
}

export interface MessageFn {
  (params?: MessageParams): MessageHandler
  closeAll(): void
}

export type MessageTypeFn = (params?: MessageParams) => MessageHandler

export interface Message extends MessageFn {
  primary: MessageTypeFn
  success: MessageTypeFn
  warning: MessageTypeFn
  info: MessageTypeFn
  danger: MessageTypeFn
  error: MessageTypeFn
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    $message: Message
  }
}
