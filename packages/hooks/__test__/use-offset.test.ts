import { nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { getStackOffset, normalizeOffset, useOffset } from '../use-offset'

describe('useOffset', () => {
  it('normalizes invalid offset with fallback', () => {
    expect(normalizeOffset(12, 0)).toBe(12)
    expect(normalizeOffset(undefined, 8)).toBe(8)
    expect(normalizeOffset(Number.NaN, 8)).toBe(8)
  })

  it('creates reactive offset style and updates current offset', async () => {
    const offset = ref(20)
    const placement = ref<'top' | 'bottom'>('top')
    const zIndex = ref(2001)
    const { currentOffset, endOffset, offsetStyle, setOffset } = useOffset({
      offset,
      defaultOffset: 8,
      placement,
      zIndex,
      size: 40,
    })

    expect(currentOffset.value).toBe(20)
    expect(endOffset.value).toBe(60)
    expect(offsetStyle.value).toEqual({ top: '20px', zIndex: 2001 })

    setOffset(32)
    expect(currentOffset.value).toBe(32)
    expect(endOffset.value).toBe(72)
    expect(offsetStyle.value).toEqual({ top: '32px', zIndex: 2001 })

    offset.value = 12
    placement.value = 'bottom'
    zIndex.value = 2002
    await nextTick()

    expect(currentOffset.value).toBe(12)
    expect(offsetStyle.value).toEqual({ bottom: '12px', zIndex: 2002 })
  })

  it('creates popper offset modifier from normalized offset', async () => {
    const offset = ref<number | undefined>(16)
    const { popperOffsetModifier } = useOffset({ offset, defaultOffset: 12 })

    expect(popperOffsetModifier.value).toEqual({
      name: 'offset',
      options: {
        offset: [0, 16],
      },
    })

    offset.value = undefined
    await nextTick()

    expect(popperOffsetModifier.value.options.offset).toEqual([0, 12])
  })

  it('calculates stack offset with base offset, size and gap', () => {
    expect(getStackOffset(30, 0, 40, 16)).toBe(30)
    expect(getStackOffset(30, 2, 40, 16)).toBe(142)
    expect(useOffset({ offset: 20, size: 50 }).getStackOffset(1, 8)).toBe(78)
  })
})
