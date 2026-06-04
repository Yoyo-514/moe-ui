import type { ComputedRef } from 'vue'

export type CollapseItemName = string | number
export type CollapseModelValue = CollapseItemName | CollapseItemName[]

export interface CollapseProps {
  modelValue?: CollapseModelValue
  accordion?: boolean
}

export interface CollapseEmits {
  (e: 'update:modelValue', value: CollapseModelValue): void
  (e: 'change', value: CollapseModelValue): void
}

export interface CollapseItemProps {
  name: CollapseItemName
  title?: string
  disabled?: boolean
}

export interface CollapseContext {
  activeNames: ComputedRef<CollapseItemName[]>
  handleItemClick: (name: CollapseItemName) => void
}
