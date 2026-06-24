import { describe, expect, it } from 'vitest'

import { mutable } from '../typescript'

describe('typescript utilities', () => {
  it('returns the same value for mutable type casting helper', () => {
    const readonlyArray = [1, 2] as const
    const readonlyObject = { name: 'moe' } as const

    expect(mutable(readonlyArray)).toBe(readonlyArray)
    expect(mutable(readonlyObject)).toBe(readonlyObject)
  })
})
