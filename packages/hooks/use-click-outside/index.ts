import { isArray, isBoolean, isFunction } from 'lodash-es'
import { unref } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'
import { useEventListener } from '../use-event-listener'

type MaybeElement = HTMLElement | null | undefined
type MaybeElementRef = MaybeRefOrGetter<MaybeElement>
type MaybeBooleanRef = MaybeRefOrGetter<boolean>

export interface UseClickOutsideOptions {
  enabled?: MaybeBooleanRef
  ignore?: MaybeElementRef[]
  eventName?: keyof DocumentEventMap
}

const resolveValue = <T>(value: MaybeRefOrGetter<T>): T =>
  isFunction(value) ? value() : unref(value)

const isEnabled = (enabled: UseClickOutsideOptions['enabled']) => {
  if (enabled === undefined) return true
  const value = resolveValue(enabled)
  return isBoolean(value) ? value : Boolean(value)
}

const containsEventTarget = (el: MaybeElement, event: Event) =>
  Boolean(el && event.target instanceof Node && el.contains(event.target))

export function useClickOutside(
  target: Ref<MaybeElement> | (() => MaybeElement),
  handler: (event: MouseEvent | PointerEvent) => void,
  options: UseClickOutsideOptions = {}
) {
  const { eventName = 'pointerdown', ignore = [] } = options

  return useEventListener(
    () => (typeof document === 'undefined' ? undefined : document),
    eventName,
    (event) => {
      if (!isEnabled(options.enabled)) return

      const targetElement = resolveValue(target)
      if (containsEventTarget(targetElement, event)) return

      const ignoredElements = isArray(ignore) ? ignore : []
      const clickedIgnoredElement = ignoredElements.some((item) =>
        containsEventTarget(resolveValue(item), event)
      )

      if (clickedIgnoredElement) return

      handler(event as MouseEvent | PointerEvent)
    }
  )
}
