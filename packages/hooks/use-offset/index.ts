import {
  computed,
  ref,
  toValue,
  watch,
  type ComputedRef,
  type CSSProperties,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { toNumber } from 'lodash-es'

export type OffsetPlacement = 'top' | 'bottom' | 'left' | 'right' | (string & {})

export interface OffsetModifier {
  name: 'offset'
  options: {
    offset: [number, number]
  }
}

export interface UseOffsetOptions {
  offset?: MaybeRefOrGetter<number | undefined>
  defaultOffset?: number
  placement?: MaybeRefOrGetter<OffsetPlacement | undefined>
  zIndex?: MaybeRefOrGetter<number | undefined>
  size?: MaybeRefOrGetter<number | undefined>
}

export interface UseOffsetReturn {
  normalizedOffset: ComputedRef<number>
  currentOffset: Ref<number>
  endOffset: ComputedRef<number>
  offsetStyle: ComputedRef<CSSProperties>
  popperOffsetModifier: ComputedRef<OffsetModifier>
  setOffset: (offset?: number) => void
  getStackOffset: (index: number, gap?: number) => number
}

export const normalizeOffset = (value: number | undefined, fallback: number) => {
  const offset = toNumber(value ?? fallback)

  return Number.isFinite(offset) ? offset : fallback
}

export const getStackOffset = (baseOffset: number, index: number, size = 0, gap = 0) =>
  normalizeOffset(baseOffset, 0) + index * (normalizeOffset(size, 0) + normalizeOffset(gap, 0))

export function useOffset(options: UseOffsetOptions = {}): UseOffsetReturn {
  const defaultOffset = options.defaultOffset ?? 0
  const normalizedOffset = computed(() => normalizeOffset(toValue(options.offset), defaultOffset))
  const currentOffset = ref(normalizedOffset.value)
  const size = computed(() => normalizeOffset(toValue(options.size), 0))

  const setOffset = (offset?: number) => {
    currentOffset.value = normalizeOffset(offset, defaultOffset)
  }

  const endOffset = computed(() => currentOffset.value + size.value)

  const offsetStyle = computed<CSSProperties>(() => {
    const placement = toValue(options.placement)
    const zIndex = toValue(options.zIndex)
    const style: CSSProperties = {}

    if (placement) {
      Object.assign(style, {
        [placement]: `${currentOffset.value}px`,
      })
    }

    if (zIndex !== undefined) {
      style.zIndex = zIndex
    }

    return style
  })

  const popperOffsetModifier = computed<OffsetModifier>(() => ({
    name: 'offset',
    options: {
      offset: [0, normalizedOffset.value],
    },
  }))

  const getCurrentStackOffset = (index: number, gap = 0) =>
    getStackOffset(normalizedOffset.value, index, size.value, gap)

  watch(normalizedOffset, (offset) => setOffset(offset))

  return {
    normalizedOffset,
    currentOffset,
    endOffset,
    offsetStyle,
    popperOffsetModifier,
    setOffset,
    getStackOffset: getCurrentStackOffset,
  }
}
