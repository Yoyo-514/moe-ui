import { Transition } from 'vue'

export interface TransitionLikeWrapper {
  findComponent(component: typeof Transition): unknown
}

export const triggerDocumentMouseDown = (target: EventTarget = document.body) => {
  target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
}

export const emitAfterLeave = (wrapper: TransitionLikeWrapper) => {
  ;(
    wrapper.findComponent(Transition) as unknown as { vm: { $emit: (event: string) => void } }
  ).vm.$emit('after-leave')
}
