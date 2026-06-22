import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import Collapse from '../src/Collapse.vue'
import CollapseItem from '../src/CollapseItem.vue'
import { MoeCollapse, MoeCollapseItem } from '../index'

describe('Collapse.vue', () => {
  it('should support plugin installation', () => {
    const wrapper = mount(
      {
        template: `
        <moe-collapse>
          <moe-collapse-item name="installed" title="Installed">
            Installed content
          </moe-collapse-item>
        </moe-collapse>
      `,
      },
      {
        global: {
          plugins: [MoeCollapse, MoeCollapseItem],
        },
      }
    )

    expect(wrapper.find('.moe-collapse').exists()).toBe(true)
    expect(wrapper.find('.moe-collapse-item').exists()).toBe(true)
  })

  it('should render collapse items', () => {
    const wrapper = mount(() => (
      <Collapse modelValue={['first']}>
        <CollapseItem name="first" title="First">
          First content
        </CollapseItem>
        <CollapseItem name="second" title="Second">
          Second content
        </CollapseItem>
      </Collapse>
    ))

    expect(wrapper.classes()).toContain('moe-collapse')
    expect(wrapper.attributes('role')).toBe('tablist')
    expect(wrapper.findAll('.moe-collapse-item')).toHaveLength(2)
    expect(wrapper.find('.moe-collapse-item').classes()).toContain('is-active')
  })

  it('should toggle items in non-accordion mode', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: ['first'],
      },
      slots: {
        default: () => [
          <CollapseItem name="first" title="First">
            First content
          </CollapseItem>,
          <CollapseItem name="second" title="Second">
            Second content
          </CollapseItem>,
        ],
      },
    })

    const headers = wrapper.findAll('.moe-collapse-item__header')
    await headers[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['first', 'second']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['first', 'second']])

    await wrapper.setProps({ modelValue: ['first', 'second'] })
    await headers[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['second']])
    expect(wrapper.emitted('change')?.[1]).toEqual([['second']])
  })

  it('should toggle item in accordion mode', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: 'first',
        accordion: true,
      },
      slots: {
        default: () => [
          <CollapseItem name="first" title="First">
            First content
          </CollapseItem>,
          <CollapseItem name="second" title="Second">
            Second content
          </CollapseItem>,
        ],
      },
    })

    const headers = wrapper.findAll('.moe-collapse-item__header')
    await headers[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['second'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['second'])

    await wrapper.setProps({ modelValue: 'second' })
    await headers[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([''])
    expect(wrapper.emitted('change')?.[1]).toEqual([''])
  })

  it('should render collapse item safely without parent collapse context', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(() => (
      <CollapseItem name="orphan" title="Orphan">
        Orphan content
      </CollapseItem>
    ))

    expect(wrapper.find('.moe-collapse-item').classes()).not.toContain('is-active')
    expect(wrapper.get('.moe-collapse-item__header').attributes('aria-expanded')).toBe('false')

    await wrapper.get('.moe-collapse-item__header').trigger('click')
    expect(wrapper.find('.moe-collapse-item').classes()).not.toContain('is-active')
    expect(warnSpy).toHaveBeenCalled()

    warnSpy.mockRestore()
  })

  it('should not toggle disabled item', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: [],
      },
      slots: {
        default: () => (
          <CollapseItem name="disabled" title="Disabled" disabled>
            Disabled content
          </CollapseItem>
        ),
      },
    })

    const header = wrapper.get('.moe-collapse-item__header')
    expect(header.attributes('aria-disabled')).toBe('true')
    expect(header.attributes('tabindex')).toBe('-1')

    await header.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('should support numeric item names', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: [1],
      },
      slots: {
        default: () => [
          <CollapseItem name={1} title="One">
            One content
          </CollapseItem>,
          <CollapseItem name={2} title="Two">
            Two content
          </CollapseItem>,
        ],
      },
    })

    expect(wrapper.find('.moe-collapse-item').classes()).toContain('is-active')

    await wrapper.findAll('.moe-collapse-item__header')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[1, 2]])
  })

  it('should ignore invalid modelValue names and warn once', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(Collapse, {
      props: {
        modelValue: ['valid', { invalid: true } as any],
      },
      slots: {
        default: () => (
          <CollapseItem name="valid" title="Valid">
            Valid content
          </CollapseItem>
        ),
      },
    })

    expect(wrapper.get('.moe-collapse-item').classes()).toContain('is-active')
    expect(warnSpy).toHaveBeenCalledOnce()
    expect(String(warnSpy.mock.calls[0][0])).toContain('modelValue should be a string')

    warnSpy.mockRestore()
  })

  it('should support space key interaction', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: [],
      },
      slots: {
        default: () => (
          <CollapseItem name="space" title="Space">
            Space content
          </CollapseItem>
        ),
      },
    })

    await wrapper.get('.moe-collapse-item__header').trigger('keydown', { key: ' ' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['space']])
  })

  it('should support title slot and keyboard interaction', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: [],
      },
      slots: {
        default: () => (
          <CollapseItem name="keyboard">
            {{
              title: () => <span class="custom-title">Custom title</span>,
              default: () => 'Keyboard content',
            }}
          </CollapseItem>
        ),
      },
    })

    expect(wrapper.get('.custom-title').text()).toBe('Custom title')

    await wrapper.get('.moe-collapse-item__header').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['keyboard']])

    await nextTick()
    await wrapper.get('.moe-collapse-item__header').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })
})
