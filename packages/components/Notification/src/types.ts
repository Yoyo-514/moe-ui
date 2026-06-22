import type { Component, ComponentInternalInstance, Ref, VNode } from 'vue'

export const notificationTypes = ['primary', 'success', 'warning', 'info', 'danger'] as const

export type NotificationType = (typeof notificationTypes)[number]
export type NotificationAliasType = NotificationType | 'error'
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
export type NotificationContent = string | VNode | (() => VNode)
export type NotificationIcon = string | Component

export interface NotificationProps {
  id: string
  title?: string
  message?: NotificationContent
  type?: NotificationAliasType
  icon?: NotificationIcon
  duration?: number
  position?: NotificationPosition
  showClose?: boolean
  onClose?: () => void
  onClick?: () => void
  offset?: number
  zIndex: number
}

export interface NotificationEmits {
  (e: 'close'): void
  (e: 'destroy'): void
  (e: 'click'): void
}

export type NotificationOptions = Partial<NotificationProps>
export type NotificationParams = string | VNode | NotificationOptions

export interface NotificationHandler {
  close(): void
}

export interface NotificationExposed {
  visible: Ref<boolean>
  close(): void
}

export interface NotificationContext {
  id: string
  props: NotificationProps
  vnode: VNode
  handler: NotificationHandler
  vm: ComponentInternalInstance
}

export interface NotificationFn {
  (params?: NotificationParams): NotificationHandler
  closeAll(): void
}

export type NotificationTypeFn = (params?: NotificationParams) => NotificationHandler

export interface Notification extends NotificationFn {
  primary: NotificationTypeFn
  success: NotificationTypeFn
  warning: NotificationTypeFn
  info: NotificationTypeFn
  danger: NotificationTypeFn
  error: NotificationTypeFn
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    $notification: Notification
  }
}
