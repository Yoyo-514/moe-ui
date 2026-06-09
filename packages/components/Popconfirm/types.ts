import type { ButtonType } from '../Button/types'

export interface PopconfirmProps {
  title?: string
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonType?: ButtonType
  cancelButtonType?: ButtonType
  icon?: string
  iconColor?: string
  hideIcon?: boolean
  hideAfter?: number
  width?: number | string
}

export interface PopconfirmEmits {
  (e: 'confirm', event: MouseEvent): void
  (e: 'cancel', event: MouseEvent): void
}
