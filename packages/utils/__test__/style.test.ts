import { afterEach, describe, expect, it, vi } from 'vitest'

import { addUnit } from '../style'

describe('style utilities', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('adds default or custom unit to numeric values', () => {
    expect(addUnit(12)).toBe('12px')
    expect(addUnit('12')).toBe('12px')
    expect(addUnit(1.5, 'rem')).toBe('1.5rem')
  })

  it('keeps non-numeric string and empty values as-is', () => {
    expect(addUnit('auto')).toBe('auto')
    expect(addUnit('100%')).toBe('100%')
    expect(addUnit(0)).toBe('')
    expect(addUnit(undefined)).toBe('')
  })

  it('warns invalid binding value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(addUnit({} as never)).toBeUndefined()
    expect(warn).toHaveBeenCalledOnce()
    expect((warn.mock.calls[0]?.[0] as Error).message).toBe(
      '[utils/style]: binding value must be a string or number'
    )
  })
})
