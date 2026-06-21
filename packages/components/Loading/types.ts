import type { App, ComponentInternalInstance, Directive, VNode } from 'vue'

export type LoadingText = string | VNode | VNode[]

export interface LoadingOptions {
  target?: HTMLElement | string
  body?: boolean
  fullscreen?: boolean
  lock?: boolean
  text?: LoadingText
  spinner?: string
  background?: string
  customClass?: string
  zIndex?: number
}

export interface LoadingProps {
  visible?: boolean
  text?: LoadingText
  spinner?: string
  background?: string
  customClass?: string
  fullscreen?: boolean
  zIndex?: number
}

export interface LoadingEmits {
  (e: 'destroy'): void
}

export interface LoadingExposed {
  close(): void
}

export interface LoadingInstance {
  close(): void
}

export interface LoadingContext {
  target: HTMLElement
  container: HTMLDivElement
  vm: ComponentInternalInstance
  originalPosition: string
  originalOverflow: string
  fullscreen: boolean
  instance: LoadingInstance
  destroyed: boolean
  destroyTimer?: ReturnType<typeof setTimeout>
}

export interface LoadingService {
  service(options?: LoadingOptions): LoadingInstance
  directive: Directive<HTMLElement, boolean>
  install(app: App): void
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    $loading: LoadingService['service']
  }
}
