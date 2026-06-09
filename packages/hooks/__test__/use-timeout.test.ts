/** @vitest-environment jsdom */
import { createApp, defineComponent, h } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useTimeout } from '../use-timeout'

const mountComposable = <T extends Record<string, unknown>>(setup: () => T) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(
    defineComponent({
      setup,
      render: () => h('div'),
    })
  )
  const vm = app.mount(host) as unknown as T
  return { app, vm }
}

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('runs callback after delay and supports clearing', () => {
    const callback = vi.fn()
    const { app, vm } = mountComposable(() => {
      const timeout = useTimeout()
      return { timeout }
    })
    const timeout = vm.timeout as ReturnType<typeof useTimeout>

    timeout.start(callback, 100)
    vi.advanceTimersByTime(99)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)

    timeout.start(callback, 100)
    timeout.clear()
    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledTimes(1)

    app.unmount()
  })

  it('cancels previous timeout when start is called again and clears on unmount', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { app, vm } = mountComposable(() => {
      const timeout = useTimeout()
      return { timeout }
    })
    const timeout = vm.timeout as ReturnType<typeof useTimeout>

    timeout.start(first, 100)
    timeout.start(second, 100)
    vi.advanceTimersByTime(100)

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)

    timeout.start(first, 100)
    app.unmount()
    vi.advanceTimersByTime(100)
    expect(first).not.toHaveBeenCalled()
  })

  it('can be reused after a scheduled callback has run', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { app, vm } = mountComposable(() => {
      const timeout = useTimeout()
      return { timeout }
    })
    const timeout = vm.timeout as ReturnType<typeof useTimeout>

    timeout.start(first, 10)
    vi.advanceTimersByTime(10)
    timeout.start(second, 10)
    vi.advanceTimersByTime(10)

    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)

    app.unmount()
  })

  it('ignores non-function callback and normalizes invalid delay to zero', () => {
    const callback = vi.fn()
    const { app, vm } = mountComposable(() => {
      const timeout = useTimeout()
      return { timeout }
    })
    const timeout = vm.timeout as ReturnType<typeof useTimeout>

    timeout.start(undefined as unknown as () => void, 10)
    vi.advanceTimersByTime(10)
    expect(callback).not.toHaveBeenCalled()

    timeout.start(callback, -10)
    vi.advanceTimersByTime(0)

    expect(callback).toHaveBeenCalledTimes(1)

    app.unmount()
  })
})
