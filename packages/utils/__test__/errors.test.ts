import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  createMoeUIError,
  debugWarn,
  debugWarnOnce,
  formatErrorMessage,
  throwError,
} from '../errors'

const originalProcess = globalThis.process

function setNodeEnv(nodeEnv: string) {
  Object.defineProperty(globalThis, 'process', {
    configurable: true,
    value: {
      env: {
        NODE_ENV: nodeEnv,
      },
    },
  })
}

describe('error utilities', () => {
  afterEach(() => {
    Object.defineProperty(globalThis, 'process', {
      configurable: true,
      value: originalProcess,
    })
    vi.restoreAllMocks()
  })

  it('formats and creates Moe UI errors', () => {
    expect(formatErrorMessage('Button', 'invalid type')).toBe('[Button]: invalid type')

    const error = createMoeUIError('Tooltip', 'missing content')
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('MoeUIError')
    expect(error.message).toBe('[Tooltip]: missing content')
  })

  it('throws Moe UI error with scoped message', () => {
    expect(() => throwError('Collapse', 'invalid active name')).toThrow(
      '[Collapse]: invalid active name'
    )
  })

  it('warns in non-production with either scoped message or Error instance', () => {
    setNodeEnv('test')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const error = new Error('manual error')

    debugWarn('Alert', 'closable is disabled')
    debugWarn(error)

    expect(warn).toHaveBeenCalledTimes(2)
    expect(warn.mock.calls[0]?.[0]).toBeInstanceOf(Error)
    expect((warn.mock.calls[0]?.[0] as Error).message).toBe('[Alert]: closable is disabled')
    expect(warn.mock.calls[1]?.[0]).toBe(error)
  })

  it('does not warn in production', () => {
    setNodeEnv('production')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    debugWarn('Tooltip', 'hidden')
    debugWarnOnce('Tooltip', 'hidden once')

    expect(warn).not.toHaveBeenCalled()
  })

  it('warns only once for the same scoped message', () => {
    setNodeEnv('development')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    debugWarnOnce('Tooltip', 'same message')
    debugWarnOnce('Tooltip', 'same message')
    debugWarnOnce('Tooltip', 'different message')

    expect(warn).toHaveBeenCalledTimes(2)
    expect((warn.mock.calls[0]?.[0] as Error).message).toBe('[Tooltip]: same message')
    expect((warn.mock.calls[1]?.[0] as Error).message).toBe('[Tooltip]: different message')
  })
})
