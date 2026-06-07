/** @vitest-environment jsdom */
import { createApp, defineComponent, h, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useClickOutside } from '../use-click-outside'

const mountedApps: Array<ReturnType<typeof createApp>> = []

const mountComposable = (setup: () => void) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(
    defineComponent({
      setup,
      render: () => h('div'),
    })
  )
  app.mount(host)
  mountedApps.push(app)
  return app
}

const dispatchMouseEvent = (target: Element, eventName: string) => {
  target.dispatchEvent(new MouseEvent(eventName, { bubbles: true }))
}

const dispatchPointerDown = (target: Element) => {
  dispatchMouseEvent(target, 'pointerdown')
}

describe('useClickOutside', () => {
  afterEach(() => {
    mountedApps.splice(0).forEach((app) => app.unmount())
    document.body.innerHTML = ''
  })

  it('calls handler when clicking outside target but not inside target', () => {
    const handler = vi.fn()
    const target = document.createElement('div')
    const outside = document.createElement('button')
    document.body.append(target, outside)

    mountComposable(() => {
      useClickOutside(ref(target), handler)
    })

    dispatchPointerDown(target)
    expect(handler).not.toHaveBeenCalled()

    dispatchPointerDown(outside)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('respects ignore elements and enabled option', () => {
    const handler = vi.fn()
    const target = document.createElement('div')
    const ignored = document.createElement('button')
    const outside = document.createElement('button')
    const enabled = ref(false)
    document.body.append(target, ignored, outside)

    mountComposable(() => {
      useClickOutside(ref(target), handler, {
        enabled,
        ignore: [ref(ignored)],
      })
    })

    dispatchPointerDown(outside)
    expect(handler).not.toHaveBeenCalled()

    enabled.value = true
    dispatchPointerDown(ignored)
    expect(handler).not.toHaveBeenCalled()

    dispatchPointerDown(outside)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('supports getter target and custom event name', () => {
    const handler = vi.fn()
    const target = document.createElement('div')
    const outside = document.createElement('button')
    document.body.append(target, outside)

    mountComposable(() => {
      useClickOutside(() => target, handler, {
        eventName: 'mousedown',
      })
    })

    dispatchPointerDown(outside)
    expect(handler).not.toHaveBeenCalled()

    dispatchMouseEvent(outside, 'mousedown')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('removes document listener after component unmount', () => {
    const handler = vi.fn()
    const target = document.createElement('div')
    const outside = document.createElement('button')
    document.body.append(target, outside)

    const app = mountComposable(() => {
      useClickOutside(() => target, handler)
    })

    app.unmount()
    dispatchPointerDown(outside)

    expect(handler).not.toHaveBeenCalled()
  })
})
