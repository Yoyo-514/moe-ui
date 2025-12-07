import type { IconifyIcon, IconifyRenderMode } from '@iconify/vue'

export interface IconProps {
  // Iconify 核心属性
  icon: IconifyIcon | string
  mode?: IconifyRenderMode
  inline?: boolean

  // 尺寸
  width?: string | number
  height?: string | number

  // 变换
  flip?: 'horizontal' | 'vertical' | 'both'
  rotate?: number | 0 | 90 | 180 | 270

  // Moe 组件扩展属性
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  color?: string
  spin?: boolean
  /** 预设尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  /** 内置动画 */
  animation?: 'spin' | 'spin-pulse' | 'beat' | 'fade' | 'bounce' | 'shake' | 'ping'
  /** 动画持续时间 (ms) */
  duration?: number
  /** hover 时显示的图标 */
  hoverIcon?: string
  /** hover 时的颜色 */
  hoverColor?: string
  /** hover 时的动画 */
  hoverAnimation?: IconProps['animation']
}

export interface IconEmits {
  (e: 'click', val: MouseEvent): void
  (e: 'load'): void
  (e: 'error', iconName: string): void
}
