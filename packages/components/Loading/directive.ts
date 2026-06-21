import type { Directive, DirectiveBinding } from 'vue'
import { LOADING_DEFAULT_SPINNER } from './constants'
import { service } from './method'
import type { LoadingInstance, LoadingOptions } from './types'

export interface LoadingElement extends HTMLElement {
  __moeLoadingInstance__?: LoadingInstance
}

const getDirectiveOptions = (
  el: LoadingElement,
  binding: DirectiveBinding<boolean>
): LoadingOptions => ({
  target: binding.modifiers.fullscreen ? document.body : el,
  fullscreen: Boolean(binding.modifiers.fullscreen),
  lock: Boolean(binding.modifiers.lock),
  text: el.getAttribute('moe-loading-text') ?? '',
  spinner: el.getAttribute('moe-loading-spinner') ?? LOADING_DEFAULT_SPINNER,
  background: el.getAttribute('moe-loading-background') ?? '',
  customClass: el.getAttribute('moe-loading-custom-class') ?? '',
})

const createLoading = (el: LoadingElement, binding: DirectiveBinding<boolean>) => {
  if (el.__moeLoadingInstance__) return

  el.__moeLoadingInstance__ = service(getDirectiveOptions(el, binding))
}

const closeLoading = (el: LoadingElement) => {
  if (!el.__moeLoadingInstance__) return

  el.__moeLoadingInstance__.close()
  el.__moeLoadingInstance__ = undefined
}

export const loadingDirective: Directive<LoadingElement, boolean> = {
  mounted(el, binding) {
    if (binding.value) createLoading(el, binding)
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) return

    if (binding.value) {
      createLoading(el, binding)
      return
    }

    closeLoading(el)
  },
  unmounted(el) {
    closeLoading(el)
  },
}
