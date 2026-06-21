import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, markRaw, nextTick } from 'vue'

import Switch from './Switch.vue'

describe('MoeSwitch', () => {
  it('renders switch semantics and checked state', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: true,
      },
    })

    const button = wrapper.get('button')
    expect(button.attributes('role')).toBe('switch')
    expect(button.attributes('aria-checked')).toBe('true')
    expect(button.classes()).toContain('is-checked')
  })

  it('emits update:modelValue and change when clicked', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
      },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])

    await wrapper.setProps({ modelValue: true })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
    expect(wrapper.emitted('change')?.[1]).toEqual([false])
  })

  it('supports string and number active/inactive values', async () => {
    const stringWrapper = mount(Switch, {
      props: {
        modelValue: 'off',
        activeValue: 'on',
        inactiveValue: 'off',
      },
    })

    await stringWrapper.trigger('click')
    expect(stringWrapper.emitted('update:modelValue')?.[0]).toEqual(['on'])

    const numberWrapper = mount(Switch, {
      props: {
        modelValue: 0,
        activeValue: 1,
        inactiveValue: 0,
      },
    })

    await numberWrapper.trigger('click')
    expect(numberWrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('does not change when disabled or loading', async () => {
    const disabledWrapper = mount(Switch, {
      props: {
        modelValue: false,
        disabled: true,
      },
    })
    await disabledWrapper.trigger('click')
    expect(disabledWrapper.emitted('update:modelValue')).toBeUndefined()
    expect(disabledWrapper.attributes('disabled')).toBeDefined()

    const loadingWrapper = mount(Switch, {
      props: {
        modelValue: false,
        loading: true,
      },
    })
    await loadingWrapper.trigger('click')
    expect(loadingWrapper.emitted('update:modelValue')).toBeUndefined()
    expect(loadingWrapper.find('.moe-switch__loading').exists()).toBe(true)
  })

  it('respects beforeChange success, false and rejected promise', async () => {
    const success = vi.fn().mockResolvedValue(true)
    const successWrapper = mount(Switch, {
      props: {
        modelValue: false,
        beforeChange: success,
      },
    })
    await successWrapper.trigger('click')
    await nextTick()
    expect(success).toHaveBeenCalledTimes(1)
    expect(successWrapper.emitted('update:modelValue')?.[0]).toEqual([true])

    const blockedWrapper = mount(Switch, {
      props: {
        modelValue: false,
        beforeChange: () => false,
      },
    })
    await blockedWrapper.trigger('click')
    await nextTick()
    expect(blockedWrapper.emitted('update:modelValue')).toBeUndefined()

    const rejectedWrapper = mount(Switch, {
      props: {
        modelValue: false,
        beforeChange: () => Promise.reject(new Error('blocked')),
      },
    })
    await rejectedWrapper.trigger('click')
    await nextTick()
    expect(rejectedWrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('blocks duplicate changes while beforeChange is pending', async () => {
    let resolveBeforeChange!: (value: boolean) => void
    const beforeChange = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveBeforeChange = resolve
        })
    )
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        beforeChange,
      },
    })

    await wrapper.trigger('click')
    await wrapper.trigger('click')
    expect(beforeChange).toHaveBeenCalledTimes(1)

    resolveBeforeChange(true)
    await nextTick()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('renders text, inline prompt and icon with expected priority', () => {
    const textWrapper = mount(Switch, {
      props: {
        modelValue: true,
        activeText: '打开',
        inactiveText: '关闭',
      },
    })
    expect(textWrapper.get('.moe-switch__label').text()).toBe('打开')

    const inlineWrapper = mount(Switch, {
      props: {
        modelValue: false,
        inlinePrompt: true,
        activeText: '开',
        inactiveText: '关',
      },
    })
    expect(inlineWrapper.get('.moe-switch__inner').text()).toBe('关')

    const IconComponent = defineComponent({
      render: () => h('span', { class: 'custom-switch-icon' }),
    })
    const iconWrapper = mount(Switch, {
      props: {
        modelValue: true,
        inlinePrompt: true,
        activeText: '开',
        activeIcon: markRaw(IconComponent),
      },
    })
    expect(iconWrapper.find('.custom-switch-icon').exists()).toBe(true)
    expect(iconWrapper.find('.moe-switch__inner').exists()).toBe(false)
  })

  it('applies size, width and name attributes', () => {
    const wrapper = mount(Switch, {
      props: {
        size: 'small',
        width: 64,
        name: 'enabled',
      },
    })

    expect(wrapper.classes()).toContain('moe-switch--small')
    expect(wrapper.attributes('name')).toBe('enabled')
    expect(wrapper.attributes('style')).toContain('--moe-switch-core-width: 64px')
  })

  it('supports keyboard toggle and focus expose', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
      },
      attachTo: document.body,
    })

    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])

    wrapper.vm.focus()
    expect(document.activeElement).toBe(wrapper.element)
    wrapper.unmount()
  })
})
