import type { NotificationPosition, NotificationType } from './types'

export const NOTIFICATION_DEFAULT_OFFSET = 16
export const NOTIFICATION_DEFAULT_DURATION = 4500
export const NOTIFICATION_HEIGHT = 96
export const NOTIFICATION_GAP = 16
export const NOTIFICATION_DEFAULT_POSITION: NotificationPosition = 'top-right'
export const NOTIFICATION_DEFAULT_TYPE: NotificationType = 'info'
export const NOTIFICATION_HORIZONTAL_OFFSET = 16

export const NOTIFICATION_ICON_MAP: Record<NotificationType, string> = {
  primary: 'mingcute:sparkles-line',
  success: 'mingcute:check-circle-line',
  warning: 'mingcute:warning-line',
  info: 'mingcute:information-line',
  danger: 'mingcute:close-circle-line',
}
