import { defineComponent, nextTick, ref } from 'vue'

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { flushTimers, popperMock as popper } from '@moe-ui/test-utils'

import { MoeTooltip } from '../index'
import Tooltip from '../src/Tooltip.vue'

const mountTooltip = (options: Parameters<typeof mount<typeof Tooltip>>[1] = {}) =>
  mount(Tooltip, {
    props: {
      content: 'Tooltip content',
      ...(options.props ?? {}),
    },
    slots: {
      default: () => <button type="button">trigger</button>,
      ...(options.slots ?? {}),
    },
    ...options,
  })

describe('Tooltip.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    popper.reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('public API', () => {
    it('registers through install and renders tooltip content on hover', async () => {
      const wrapper = mount(
        {
          template: `
            <moe-tooltip content="Installed tooltip">
              <button type="button">trigger</button>
            </moe-tooltip>
          `,
        },
        {
          global: {
            plugins: [MoeTooltip],
          },
        }
      )

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()

      expect(wrapper.get('[role="tooltip"]').text()).toContain('Installed tooltip')
    })

    it('supports v-model:visible as component visibility', async () => {
      const Demo = defineComponent({
        components: { Tooltip },
        setup() {
          const visible = ref(false)
          return { visible }
        },
        template: `
          <Tooltip v-model:visible="visible" content="Model tooltip" trigger="click">
            <button type="button">trigger</button>
          </Tooltip>
        `,
      })
      const wrapper = mount(Demo)

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()

      expect(wrapper.vm.visible).toBe(true)
      expect(wrapper.get('[role="tooltip"]').text()).toContain('Model tooltip')

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()

      expect(wrapper.vm.visible).toBe(false)
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    })

    it('exposes show and hide methods', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Expose tooltip',
          hideAfter: 0,
        },
      })

      wrapper.vm.show()
      await flushTimers()
      expect(wrapper.get('[role="tooltip"]').text()).toContain('Expose tooltip')

      wrapper.vm.hide()
      await flushTimers()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    })
  })

  describe('DOM and semantic output', () => {
    it('renders text, theme class and tooltip role when visible', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Light tooltip',
          effect: 'light',
          visible: true,
        },
      })

      await flushTimers()

      const tooltip = wrapper.get('[role="tooltip"]')
      expect(tooltip.text()).toContain('Light tooltip')
      expect(tooltip.classes()).toContain('moe-tooltip__popper')
      expect(tooltip.classes()).toContain('is-light')
      expect(Number(tooltip.attributes('style')?.match(/z-index:\s*(\d+)/)?.[1])).toBeGreaterThan(
        2000
      )
    })

    it('renders content slot before content prop', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'prop content',
        },
        slots: {
          default: () => <button type="button">trigger</button>,
          content: () => <strong class="custom-content">slot content</strong>,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()

      expect(wrapper.get('.custom-content').text()).toBe('slot content')
      expect(wrapper.get('[role="tooltip"]').text()).not.toContain('prop content')
    })
  })

  describe('user interactions', () => {
    it('shows on hover and hides when mouse leaves tooltip container', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Hover tooltip',
          showAfter: 10,
          hideAfter: 20,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()

      expect(wrapper.get('[role="tooltip"]').text()).toContain('Hover tooltip')
      expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
      expect(wrapper.emitted('show')).toHaveLength(1)

      await wrapper.get('.moe-tooltip').trigger('mouseleave')
      await flushTimers()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
      expect(wrapper.emitted('update:visible')?.[1]).toEqual([false])
      expect(wrapper.emitted('hide')).toHaveLength(1)
    })

    it('keeps hover tooltip visible when pointer enters popper before hide delay', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Interactive hover tooltip',
          showAfter: 0,
          hideAfter: 100,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)

      await wrapper.get('.moe-tooltip').trigger('mouseleave')
      await vi.advanceTimersByTimeAsync(50)
      await wrapper.get('[role="tooltip"]').trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(50)
      await nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
      expect(wrapper.emitted('hide')).toBeUndefined()
    })

    it('does not emit duplicate visibility change when already visible', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Repeat hover tooltip',
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
      expect(wrapper.emitted('update:visible')).toEqual([[true]])
      expect(wrapper.emitted('show')).toHaveLength(1)
    })

    it('toggles visibility by click trigger', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Click tooltip',
          trigger: 'click',
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    })

    it('hides click tooltip when clicking outside but keeps it when clicking inside', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Outside close tooltip',
          trigger: 'click',
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)

      wrapper
        .get('[role="tooltip"]')
        .element.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      await flushTimers()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)

      document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      await flushTimers()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
      expect(wrapper.emitted('update:visible')?.slice(-1)[0]).toEqual([false])
    })

    it('supports combined hover and click triggers', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Combined tooltip',
          trigger: ['hover', 'click'],
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()
      expect(wrapper.get('[role="tooltip"]').text()).toContain('Combined tooltip')
    })
  })

  describe('controlled and boundary states', () => {
    it('does not mutate DOM visibility by trigger when visible prop is controlled as false', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Controlled tooltip',
          trigger: 'click',
          visible: false,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()

      expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    })

    it('hides when controlled visible changes to false', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Controlled visible tooltip',
          visible: true,
        },
      })

      await flushTimers()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)

      await wrapper.setProps({ visible: false })
      await flushTimers()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    })

    it('rebinds user interaction when trigger prop changes', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Changed trigger tooltip',
          trigger: 'hover',
        },
      })

      await wrapper.setProps({ trigger: 'click' })
      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()
      expect(wrapper.get('[role="tooltip"]').text()).toContain('Changed trigger tooltip')
    })

    it('rebinds trigger events when disabled changes back to false', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Enabled again tooltip',
          disabled: true,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)

      await wrapper.setProps({ disabled: false })
      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()

      expect(wrapper.get('[role="tooltip"]').text()).toContain('Enabled again tooltip')
    })

    it('hides visible tooltip when disabled becomes true', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Disabled later tooltip',
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)

      await wrapper.setProps({ disabled: true })
      await flushTimers()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
      expect(wrapper.emitted('update:visible')?.slice(-1)[0]).toEqual([false])
    })

    it('does not show when disabled or content is empty', async () => {
      const disabledWrapper = mountTooltip({
        props: {
          content: 'Disabled tooltip',
          disabled: true,
        },
      })
      await disabledWrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      expect(disabledWrapper.find('[role="tooltip"]').exists()).toBe(false)
      expect(disabledWrapper.emitted('update:visible')).toBeUndefined()

      const emptyWrapper = mountTooltip({
        props: {
          content: '',
        },
      })
      await emptyWrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      expect(emptyWrapper.find('[role="tooltip"]').exists()).toBe(false)
    })
  })

  describe('positioning integration supplement', () => {
    it('passes placement, offset and popper-options after tooltip becomes visible', async () => {
      const preventOverflowModifier = {
        name: 'preventOverflow',
        options: { padding: 8 },
      }
      const wrapper = mountTooltip({
        props: {
          content: 'Positioned tooltip',
          placement: 'right-start',
          offset: 16,
          popperOptions: {
            strategy: 'fixed',
            modifiers: [preventOverflowModifier],
          },
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
      expect(popper.createPopper).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.any(HTMLElement),
        expect.objectContaining({
          placement: 'right-start',
          strategy: 'fixed',
          modifiers: expect.arrayContaining([
            expect.objectContaining({
              name: 'offset',
              options: { offset: [0, 16] },
            }),
            preventOverflowModifier,
          ]),
        })
      )
    })

    it('keeps hidden tooltip hidden when placement props change', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Hidden positioning tooltip',
          placement: 'top',
          offset: 12,
        },
      })

      await wrapper.setProps({ placement: 'right', offset: 20 })
      await nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
      expect(popper.popperSetOptions).not.toHaveBeenCalled()
      expect(popper.popperUpdate).not.toHaveBeenCalled()
    })

    it('does not destroy active popper instance from stale transition leave element', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Stale transition tooltip',
          hideAfter: 0,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      const firstPopper = wrapper.get('[role="tooltip"]').element

      await wrapper.get('.moe-tooltip').trigger('mouseleave')
      await flushTimers()
      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      expect(popper.createPopper).toHaveBeenCalledTimes(2)

      const transition = wrapper.getComponent({ name: 'transition' })
      transition.vm.$emit('after-leave', firstPopper)
      await nextTick()

      await wrapper.setProps({ placement: 'right' })
      await nextTick()

      expect(popper.popperInstances[1].setOptions).toHaveBeenCalled()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
    })

    it('updates placement and offset while tooltip remains visible', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Dynamic positioning tooltip',
          placement: 'top',
          offset: 12,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      await wrapper.setProps({ placement: 'right', offset: 20 })
      await nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
      expect(popper.popperSetOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: 'right',
          modifiers: expect.arrayContaining([
            expect.objectContaining({
              name: 'offset',
              options: { offset: [0, 20] },
            }),
          ]),
        })
      )
      expect(popper.popperUpdate).toHaveBeenCalled()
    })

    it('releases popper resources when unmounted after showing', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Unmount tooltip',
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      wrapper.unmount()

      expect(popper.popperDestroy).toHaveBeenCalled()
    })

    it('replaces stale popper instance when user shows tooltip again quickly', async () => {
      const wrapper = mountTooltip({
        props: {
          content: 'Rapid visibility tooltip',
          hideAfter: 0,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()
      expect(popper.createPopper).toHaveBeenCalledTimes(1)
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)

      await wrapper.get('.moe-tooltip').trigger('mouseleave')
      await flushTimers()
      await wrapper.get('.moe-tooltip__trigger').trigger('mouseenter')
      await flushTimers()

      expect(popper.createPopper).toHaveBeenCalledTimes(2)
      expect(popper.popperInstances[0].destroy).toHaveBeenCalled()
      expect(wrapper.get('[role="tooltip"]').text()).toContain('Rapid visibility tooltip')
    })
  })
})
