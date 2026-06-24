import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

import { useEventListener as useVueUseEventListener } from '@vueuse/core'

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
  return useVueUseEventListener(() => toValue(target), event, listener, options)
}
