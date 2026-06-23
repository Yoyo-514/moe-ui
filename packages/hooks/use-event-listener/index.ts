import { onUnmounted, unref, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

import { isFunction } from 'lodash-es'

export type EventTargetRef<T extends EventTarget = EventTarget> = MaybeRefOrGetter<
  T | null | undefined
>

export type EventListenerCleanup = () => void

export function useEventListener<K extends keyof WindowEventMap>(
  target: EventTargetRef<Window>,
  event: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): EventListenerCleanup
export function useEventListener<K extends keyof DocumentEventMap>(
  target: EventTargetRef<Document>,
  event: K,
  listener: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions
): EventListenerCleanup
export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: EventTargetRef<HTMLElement>,
  event: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): EventListenerCleanup
export function useEventListener(
  target: EventTargetRef,
  event: string,
  listener: EventListener,
  options?: AddEventListenerOptions
): EventListenerCleanup
export function useEventListener(
  target: EventTargetRef,
  event: string,
  listener: EventListener,
  options?: AddEventListenerOptions
) {
  let cleanup: EventListenerCleanup | undefined

  const resolveTarget = () => (isFunction(target) ? target() : unref(target))

  const stopWatch = watch(
    resolveTarget,
    (el) => {
      cleanup?.()
      cleanup = undefined

      if (!el) return

      el.addEventListener(event, listener, options)
      cleanup = () => {
        el.removeEventListener(event, listener, options)
      }
    },
    { immediate: true }
  )

  const stop = () => {
    cleanup?.()
    cleanup = undefined
    stopWatch()
  }

  onUnmounted(stop)

  return stop
}
