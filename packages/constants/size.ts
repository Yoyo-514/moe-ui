export const componentSizes = ['', 'large', 'default', 'small'] as const
export type ComponentSize = (typeof componentSizes)[number]

export const DEFAULT_COMPONENT_SIZE: ComponentSize = 'default'
