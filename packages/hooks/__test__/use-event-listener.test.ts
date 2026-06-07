/** @vitest-environment jsdom */
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useEventListener } from '../use-event-listener'

const mountedApps: Array<ReturnType<typeof createApp>> = []

const mountComposable = <T extends Record<string, unknown>>(setup: () => T | void) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(
    defineComponent({
      setup,
      render: () => h('div'),
    })
  )
  const vm = app.mount(host) as unknown as T
  mountedApps.push(app)
  return { app, vm }
}

describe('useEventListener', () => {
  afterEach(() => {
    mountedApps.splice(0).forEach((app) => app.unmount())
    document.body.innerHTML = ''
  })

  it('binds event listener to target and removes it by returned cleanup', () => {
    const handler = vi.fn()
    const target = document.createElement('button')
    const { vm } = mountComposable(() => {
      const stop = useEventListener(target, 'click', handler)
      return { stop }
    })

    target.click()
    expect(handler).toHaveBeenCalledTimes(1)

    const stop = vm.stop as () => void
    stop()
    target.click()
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('rebinds when ref target changes and cleans up on unmount', async () => {
    const first = document.createElement('button')
    const second = document.createElement('button')
    const handler = vi.fn()
    const currentTarget = ref<EventTarget | null>(first)

    const { app } = mountComposable(() => {
      useEventListener(currentTarget, 'click', handler)
    })

    first.click()
    expect(handler).toHaveBeenCalledTimes(1)

    currentTarget.value = second
    await nextTick()

    first.click()
    second.click()
    expect(handler).toHaveBeenCalledTimes(2)

    app.unmount()
    second.click()
    expect(handler).toHaveBeenCalledTimes(2)
  })

  it('supports getter target and native listener options', () => {
    const handler = vi.fn()
    const target = document.createElement('button')

    mountComposable(() => {
      useEventListener(() => target, 'click', handler, { once: true })
    })

    target.click()
    target.click()

    expect(handler).toHaveBeenCalledTimes(1)
  })
})
