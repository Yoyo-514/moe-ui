import type { Options, Placement } from '@popperjs/core'

export type TooltipTrigger = 'hover' | 'click' | 'manual'
export type TooltipPlacement = Placement
export type TooltipEffect = 'dark' | 'light'

export interface TooltipProps {
  content?: string
  placement?: TooltipPlacement
  trigger?: TooltipTrigger | TooltipTrigger[]
  disabled?: boolean
  visible?: boolean
  showAfter?: number
  hideAfter?: number
  offset?: number
  effect?: TooltipEffect
  transition?: string
  popperOptions?: Partial<Options>
  popperClass?: string | string[]
  showArrow?: boolean
  hideOnClickOutside?: boolean
}

export interface TooltipEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'show'): void
  (e: 'hide'): void
}

export interface TooltipInstance {
  show: () => void
  hide: () => void
}
