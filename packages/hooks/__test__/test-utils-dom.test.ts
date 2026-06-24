import { Transition } from 'vue'

import { describe, expect, it, vi } from 'vitest'

import { emitAfterLeave, triggerDocumentMouseDown } from '@moe-ui/test-utils'

describe('test-utils dom helpers', () => {
  it('triggers mousedown on document body or custom target', () => {
    const bodyListener = vi.fn()
    const targetListener = vi.fn()
    const target = document.createElement('button')

    document.body.addEventListener('mousedown', bodyListener)
    target.addEventListener('mousedown', targetListener)

    triggerDocumentMouseDown()
    triggerDocumentMouseDown(target)

    expect(bodyListener).toHaveBeenCalledOnce()
    expect(targetListener).toHaveBeenCalledOnce()

    document.body.removeEventListener('mousedown', bodyListener)
  })

  it('emits transition after-leave event from wrapper', () => {
    const emit = vi.fn()
    const wrapper = {
      findComponent: vi.fn(() => ({
        vm: {
          $emit: emit,
        },
      })),
    }

    emitAfterLeave(wrapper)

    expect(wrapper.findComponent).toHaveBeenCalledWith(Transition)
    expect(emit).toHaveBeenCalledWith('after-leave')
  })
})
