import type { MessagePlacement, MessageType } from './types'

export const MESSAGE_DEFAULT_OFFSET = 20
export const MESSAGE_DEFAULT_DURATION = 3000
export const MESSAGE_HEIGHT = 44
export const MESSAGE_GAP = 16
export const MESSAGE_DEFAULT_PLACEMENT: MessagePlacement = 'top'
export const MESSAGE_DEFAULT_TYPE: MessageType = 'info'

export const MESSAGE_ICON_MAP: Record<MessageType, string> = {
  primary: 'mingcute:sparkles-line',
  success: 'mingcute:check-circle-line',
  warning: 'mingcute:warning-line',
  info: 'mingcute:information-line',
  danger: 'mingcute:close-circle-line',
}
