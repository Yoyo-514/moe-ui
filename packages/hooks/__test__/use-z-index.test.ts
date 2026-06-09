import { beforeEach, describe, expect, it } from 'vitest'

import { resetZIndex, useZIndex } from '../use-z-index'

describe('useZIndex', () => {
  beforeEach(() => {
    resetZIndex()
  })

  it('returns current z-index and increments shared sequence', () => {
    const first = useZIndex()
    const second = useZIndex()

    expect(first.currentZIndex()).toBe(2000)
    expect(first.nextZIndex()).toBe(2001)
    expect(second.nextZIndex()).toBe(2002)
    expect(first.currentZIndex()).toBe(2002)
  })

  it('can raise initial z-index without decreasing existing sequence', () => {
    expect(useZIndex(3000).currentZIndex()).toBe(3000)
    expect(useZIndex(1000).currentZIndex()).toBe(3000)
    expect(useZIndex().nextZIndex()).toBe(3001)
  })

  it('keeps current seed when initial value cannot raise the sequence', () => {
    expect(useZIndex(0).currentZIndex()).toBe(2000)
    expect(useZIndex(Number.NaN).currentZIndex()).toBe(2000)
  })
})
