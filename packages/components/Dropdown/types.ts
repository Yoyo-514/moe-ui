import type { Component, ComputedRef } from 'vue'
import type { ButtonSize, ButtonType } from '../Button/types'
import type { TooltipProps } from '../Tooltip/types'

export type DropdownCommand = string | number | object

export interface DropdownItemProps {
  command?: DropdownCommand
  icon?: string | Component
  disabled?: boolean
  divided?: boolean
}

export interface DropdownProps extends TooltipProps {
  type?: ButtonType
  size?: ButtonSize
  items?: DropdownItemProps[]
  hideOnClick?: boolean
  splitButton?: boolean
}

export interface DropdownEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'command', value: DropdownCommand): void
  (e: 'click', value: MouseEvent): void
}

export interface DropdownInstance {
  open(): void
  close(): void
}

export interface DropdownContext {
  handleItemClick(item: DropdownItemProps): void
  size: ComputedRef<ButtonSize | undefined>
}
