import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Button from './Button.vue'

describe('Button.vue', () => {
  // Props: type
  it('should has the correct type class when type prop is set', () => {
    const types = ['primary', 'success', 'warning', 'danger', 'info']
    types.forEach((type) => {
      const wrapper = mount(Button, {
        props: { type: type as any },
      })
      expect(wrapper.classes()).toContain(`moe-button--${type}`)
    })
  })

  // Props: size
  it('should has the correct size class when size prop is set', () => {
    const sizes = ['large', 'default', 'small']
    sizes.forEach((size) => {
      const wrapper = mount(Button, {
        props: { size: size as any },
      })
      expect(wrapper.classes()).toContain(`moe-button--${size}`)
    })
  })

  // Props: plain, round, circle
  it.each([
    ['plain', 'is-plain'],
    ['round', 'is-round'],
    ['circle', 'is-circle'],
    ['disabled', 'is-disabled'],
    ['loading', 'is-loading'],
  ])('should has the correct class when prop %s is set to true', (prop, className) => {
    const wrapper = mount(Button, {
      props: { [prop]: true },
      global: {
        stubs: ['MoeIcon'],
      },
    })
    expect(wrapper.classes()).toContain(className)
  })

  // Props: native-type
  it('should has the correct native type attribute when native-type prop is set', () => {
    const wrapper = mount(Button, {
      props: { nativeType: 'submit' },
    })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect((wrapper.element as any).type).toBe('submit')
  })

  // Props: tag
  it('should renders the custom tag when tag prop is set', () => {
    const wrapper = mount(Button, {
      props: { tag: 'a' },
    })
    expect(wrapper.element.tagName.toLowerCase()).toBe('a')
  })

  // Events: click
  it('should emits a click event when the button is clicked', async () => {
    const wrapper = mount(Button, {})
    await wrapper.trigger('click')
    expect(wrapper.emitted().click).toHaveLength(1)
  })

  // Props: icon
  it('should render icon when icon prop is set', () => {
    const wrapper = mount(Button, {
      props: { icon: 'mdi:home' },
      global: { stubs: ['MoeIcon'] },
    })
    expect(wrapper.find('moe-icon-stub').exists()).toBe(true)
  })

  // iconStyle: marginRight based on slot
  it('should have marginRight 6px when icon with slot content', () => {
    const wrapper = mount(Button, {
      props: { icon: 'mdi:home' },
      slots: { default: 'Click me' },
      global: { stubs: ['MoeIcon'] },
    })
    expect(wrapper.find('moe-icon-stub').attributes('style')).toContain('margin-right: 6px')
  })

  it('should have marginRight 0px when icon without slot content', () => {
    const wrapper = mount(Button, {
      props: { icon: 'mdi:home' },
      global: { stubs: ['MoeIcon'] },
    })
    expect(wrapper.find('moe-icon-stub').attributes('style')).toContain('margin-right: 0px')
  })

  // Props: loadingIcon
  it('should render custom loading icon when loadingIcon prop is set', () => {
    const wrapper = mount(Button, {
      props: { loading: true, loadingIcon: 'mdi:spinner' },
      global: { stubs: ['MoeIcon'] },
    })
    expect(wrapper.find('moe-icon-stub').attributes('icon')).toBe('mdi:spinner')
  })

  // Props: useThrottle
  it.each([
    ['withoutThrottle', false],
    ['withThrottle', true],
  ])('emits click events %s', async (_, useThrottle) => {
    const clickSpy = vi.fn()
    const wrapper = mount(() => (
      <Button onClick={clickSpy} {...{ useThrottle, throttleDuration: 400 }} />
    ))

    await wrapper.get('button').trigger('click')
    await wrapper.get('button').trigger('click')
    await wrapper.get('button').trigger('click')
    expect(clickSpy).toBeCalledTimes(useThrottle ? 1 : 3)
  })

  // Disabled: should not emit click
  it('should not emit click when disabled', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      global: { stubs: ['MoeIcon'] },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted().click).toBeUndefined()
  })
})
