export type AlertType = 'success' | 'warning' | 'info' | 'danger'
export type AlertEffect = 'light' | 'dark'

export interface AlertProps {
  title?: string
  type?: AlertType
  description?: string
  closable?: boolean
  closeText?: string
  showIcon?: boolean
  center?: boolean
  effect?: AlertEffect
}

export interface AlertEmits {
  (e: 'close', val?: MouseEvent): void
}

export interface AlertInstance {
  open: () => void
  close: (event?: MouseEvent) => void
}
