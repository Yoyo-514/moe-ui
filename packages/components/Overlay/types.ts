import type { CSSProperties } from 'vue'

export interface OverlayProps {
  visible?: boolean
  /**
   * Whether to render the visual mask.
   */
  mask?: boolean
  zIndex?: number
  overlayClass?: string | string[]
}

export interface OverlayEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'after-leave'): void
}

export type OverlayStyle = CSSProperties
