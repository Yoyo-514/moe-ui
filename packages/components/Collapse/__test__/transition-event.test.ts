import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { collapseTransitionEvents } from '../src/transition-event'

function createTransitionElement(scrollHeight = 120) {
  const element = document.createElement('div')
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  })
  return element
}

describe('collapseTransitionEvents', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        callback(0)
        return 0
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should set initial style before enter', () => {
    const element = createTransitionElement()

    collapseTransitionEvents.beforeEnter(element)

    expect(element.style.height).toBe('0px')
    expect(element.style.overflow).toBe('hidden')
  })

  it('should expand to scrollHeight on enter', () => {
    const element = createTransitionElement(96)

    collapseTransitionEvents.enter(element)

    expect(element.style.height).toBe('96px')
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2)
  })

  it('should reset style after enter', () => {
    const element = createTransitionElement()
    element.style.height = '120px'
    element.style.overflow = 'hidden'

    collapseTransitionEvents.afterEnter(element)

    expect(element.style.height).toBe('')
    expect(element.style.overflow).toBe('')
  })

  it('should set current height before leave', () => {
    const element = createTransitionElement(88)

    collapseTransitionEvents.beforeLeave(element)

    expect(element.style.height).toBe('88px')
    expect(element.style.overflow).toBe('hidden')
  })

  it('should collapse to zero height on leave', () => {
    const element = createTransitionElement(88)
    element.style.height = '88px'

    collapseTransitionEvents.leave(element)

    expect(element.style.height).toBe('0px')
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2)
  })

  it('should reset style after leave', () => {
    const element = createTransitionElement()
    element.style.height = '0px'
    element.style.overflow = 'hidden'

    collapseTransitionEvents.afterLeave(element)

    expect(element.style.height).toBe('')
    expect(element.style.overflow).toBe('')
  })
})
