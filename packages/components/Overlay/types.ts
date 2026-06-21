import type { CSSProperties, HTMLAttributes } from 'vue'

export type OverlayPosition = 'fixed' | 'absolute'

export interface OverlayProps {
  visible?: boolean
  /**
   * Whether to render the visual mask.
   */
  mask?: boolean
  position?: OverlayPosition
  zIndex?: number
  overlayClass?: HTMLAttributes['class']
  overlayStyle?: OverlayStyle
}

export interface OverlayEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'after-leave'): void
}

export type OverlayStyle = CSSProperties
