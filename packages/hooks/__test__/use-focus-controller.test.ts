/** @vitest-environment jsdom */
import { nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { useFocusController, type FocusTarget } from '../use-focus-controller'

describe('useFocusController', () => {
  it('controls focused state from focus and blur handlers', () => {
    const target = ref<FocusTarget>()
    const controller = useFocusController({ target })

    expect(controller.isFocused.value).toBe(false)
    controller.handleFocus()
    expect(controller.isFocused.value).toBe(true)
    controller.handleBlur()
    expect(controller.isFocused.value).toBe(false)
  })

  it('focuses target after next tick and blurs synchronously', async () => {
    const input = document.createElement('input')
    input.focus = vi.fn()
    input.blur = vi.fn()
    const target = ref<FocusTarget>(input)
    const controller = useFocusController({ target })

    const promise = controller.focus()
    expect(input.focus).not.toHaveBeenCalled()
    await promise
    expect(input.focus).toHaveBeenCalledOnce()

    controller.blur()
    expect(input.blur).toHaveBeenCalledOnce()
  })

  it('supports beforeFocus and beforeBlur guards', async () => {
    const input = document.createElement('input')
    input.focus = vi.fn()
    input.blur = vi.fn()
    const target = ref<FocusTarget>(input)
    const controller = useFocusController({
      target,
      beforeFocus: () => false,
      beforeBlur: () => false,
    })

    await controller.focus()
    await nextTick()
    controller.blur()

    expect(input.focus).not.toHaveBeenCalled()
    expect(input.blur).not.toHaveBeenCalled()
  })

  it('does nothing when target is missing', async () => {
    const target = ref<FocusTarget>()
    const controller = useFocusController({ target })

    await expect(controller.focus()).resolves.toBeUndefined()
    expect(() => controller.blur()).not.toThrow()
  })
})
