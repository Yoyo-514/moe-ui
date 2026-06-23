import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { emitAfterLeave } from '@moe-ui/test-utils'

import Overlay from '../src/Overlay.vue'

describe('Overlay.vue', () => {
  it('renders masked overlay with z-index, custom class and slot', () => {
    const wrapper = mount(Overlay, {
      props: {
        visible: true,
        mask: true,
        position: 'absolute',
        zIndex: 3000,
        overlayClass: 'custom-overlay',
      },
      slots: {
        default: '<div class="overlay-content">内容</div>',
      },
    })

    const overlay = wrapper.get('.moe-overlay')
    expect(overlay.isVisible()).toBe(true)
    expect(overlay.classes()).toContain('is-mask')
    expect(overlay.classes()).toContain('moe-overlay--absolute')
    expect(overlay.classes()).toContain('custom-overlay')
    expect(overlay.attributes('style')).toContain('z-index: 3000')
    expect(wrapper.get('.overlay-content').text()).toBe('内容')
  })

  it('supports no-mask state and emits click and after-leave', async () => {
    const wrapper = mount(Overlay, {
      props: {
        visible: true,
        mask: false,
      },
    })

    expect(wrapper.get('.moe-overlay').classes()).toContain('is-no-mask')
    expect(wrapper.get('.moe-overlay').classes()).toContain('moe-overlay--fixed')

    await wrapper.get('.moe-overlay').trigger('click')
    emitAfterLeave(wrapper)

    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('after-leave')).toHaveLength(1)
  })
})
