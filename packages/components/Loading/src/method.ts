import { createVNode, render } from 'vue'

import { useZIndex } from '@moe-ui/hooks'

import {
  LOADING_DEFAULT_SPINNER,
  LOADING_DEFAULT_Z_INDEX,
  LOADING_FULLSCREEN_CLASS,
  LOADING_PARENT_CLASS,
} from './constants'
import LoadingConstructor from './Loading.vue'

import type { LoadingContext, LoadingInstance, LoadingOptions, LoadingProps } from './types'

let fullscreenInstance: LoadingInstance | undefined

const isElement = (value: unknown): value is HTMLElement => value instanceof HTMLElement

export function resolveTarget(target?: HTMLElement | string): HTMLElement {
  if (typeof document === 'undefined') return undefined as unknown as HTMLElement

  if (isElement(target)) return target
  if (typeof target === 'string') {
    const element = document.querySelector<HTMLElement>(target)
    if (element) return element
  }

  return document.body
}

function setTargetPosition(target: HTMLElement, fullscreen: boolean) {
  if (fullscreen) return ''

  const originalPosition = target.style.position
  const computedPosition = window.getComputedStyle(target).position
  if (computedPosition === 'static') {
    target.style.position = 'relative'
  }

  return originalPosition
}

function removeContext(context: LoadingContext) {
  if (context.destroyed) return

  context.destroyed = true
  if (context.destroyTimer) {
    clearTimeout(context.destroyTimer)
    context.destroyTimer = undefined
  }

  context.target.classList.remove(LOADING_PARENT_CLASS)
  if (context.fullscreen) {
    context.target.classList.remove(LOADING_FULLSCREEN_CLASS)
    document.body.style.overflow = context.originalOverflow
    fullscreenInstance = undefined
  } else {
    context.target.style.position = context.originalPosition
  }

  render(null, context.container)
  context.container.remove()
}

export function service(options: LoadingOptions = {}): LoadingInstance {
  if (typeof document === 'undefined') {
    return {
      close: () => undefined,
    }
  }

  const fullscreen = options.fullscreen ?? (!options.target && !options.body)
  if (fullscreen && fullscreenInstance) return fullscreenInstance

  const target = fullscreen || options.body ? document.body : resolveTarget(options.target)
  const container = document.createElement('div')
  const originalPosition = setTargetPosition(target, fullscreen)
  const originalOverflow = document.body.style.overflow
  const { nextZIndex } = useZIndex(options.zIndex ?? LOADING_DEFAULT_Z_INDEX)

  let context = {} as LoadingContext
  const props: LoadingProps & { onDestroy: () => void } = {
    visible: true,
    text: options.text ?? '',
    spinner: options.spinner ?? LOADING_DEFAULT_SPINNER,
    background: options.background ?? '',
    customClass: options.customClass ?? '',
    fullscreen,
    zIndex: options.zIndex ?? nextZIndex(),
    onDestroy: () => removeContext(context),
  }

  const vnode = createVNode(LoadingConstructor, props as unknown as Record<string, unknown>)
  target.appendChild(container)
  target.classList.add(LOADING_PARENT_CLASS)
  if (fullscreen) {
    target.classList.add(LOADING_FULLSCREEN_CLASS)
    if (options.lock) document.body.style.overflow = 'hidden'
  }

  render(vnode, container)

  if (!vnode.component) {
    render(null, container)
    container.remove()
    return {
      close: () => undefined,
    }
  }

  const instance: LoadingInstance = {
    close: () => {
      const exposed = vnode.component?.exposed as { close?: () => void } | undefined
      exposed?.close?.()
      context.destroyTimer = setTimeout(() => removeContext(context), 200)
    },
  }

  context = {
    target,
    container,
    vm: vnode.component,
    originalPosition,
    originalOverflow,
    fullscreen,
    instance,
    destroyed: false,
  }

  if (fullscreen) fullscreenInstance = instance

  return instance
}
