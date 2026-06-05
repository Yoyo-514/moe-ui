import { Icon as IconifyIcon } from '@iconify/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Icon from './Icon.vue'

const IconifyStub = {
  name: 'Icon',
  props: ['icon', 'width', 'height', 'flip'],
  emits: ['load', 'error'],
  template: '<svg />',
}

const global = {
  stubs: {
    Icon: IconifyStub,
  },
}

describe('Icon.vue', () => {
  // Props: type
  it('should has the correct type class when type prop is set', () => {
    const types = ['primary', 'success', 'warning', 'danger', 'info']
    types.forEach((type) => {
      const wrapper = mount(Icon, {
        props: { icon: 'mdi:home', type: type as any },
        global,
      })
      expect(wrapper.classes()).toContain(`moe-icon--${type}`)
    })
  })

  // Props: size
  it('should has the correct size class when size prop is set', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']
    sizes.forEach((size) => {
      const wrapper = mount(Icon, {
        props: { icon: 'mdi:home', size: size as any },
        global,
      })
      expect(wrapper.classes()).toContain(`moe-icon--${size}`)
    })
  })

  // Props: spin
  it('should has animation-spin class when spin prop is true', () => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home', spin: true },
      global,
    })
    expect(wrapper.classes()).toContain('animation-spin')
  })

  // Props: animation
  it.each([
    ['spin', 'animation-spin'],
    ['spin-pulse', 'animation-spin-pulse'],
    ['beat', 'animation-beat'],
    ['fade', 'animation-fade'],
    ['bounce', 'animation-bounce'],
    ['shake', 'animation-shake'],
    ['ping', 'animation-ping'],
  ])('should has the correct class when animation is %s', (animation, className) => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home', animation: animation as any },
      global,
    })
    expect(wrapper.classes()).toContain(className)
  })

  // Props: color
  it('should apply custom color style when color prop is set', () => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home', color: '#ff0000' },
      global,
    })
    expect(wrapper.attributes('style')).toContain('color: rgb(255, 0, 0)')
  })

  // Events: click
  it('should emits a click event when the icon is clicked', async () => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home' },
      global,
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted().click).toHaveLength(1)
  })

  // Hover: hoverColor
  it('should apply hoverColor when hovered', async () => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home', color: '#000', hoverColor: '#ff0000' },
      global,
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.attributes('style')).toContain('color: rgb(255, 0, 0)')
    await wrapper.trigger('mouseleave')
    expect(wrapper.attributes('style')).toContain('color: rgb(0, 0, 0)')
  })

  // Hover: hoverAnimation
  it('should apply hoverAnimation when hovered', async () => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home', hoverAnimation: 'bounce' },
      global,
    })
    expect(wrapper.classes()).not.toContain('animation-bounce')
    await wrapper.trigger('mouseenter')
    expect(wrapper.classes()).toContain('animation-bounce')
  })

  // Props: duration
  it('should set custom duration style', () => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home', duration: 500 },
      global,
    })
    expect(wrapper.attributes('style')).toContain('--moe-icon-duration: 500ms')
  })

  // Props: width/height priority over size
  it('should use width/height over size when both provided', () => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home', size: 'xl', width: '100px' },
      global,
    })
    const iconify = wrapper.findComponent(IconifyIcon)
    expect(iconify.props('width')).toBe('100px')
  })

  // Props: flip
  it.each([
    ['horizontal', 'horizontal'],
    ['vertical', 'vertical'],
    ['both', 'horizontal,vertical'],
  ])('should transform flip %s to %s', (input, expected) => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home', flip: input as any },
      global,
    })
    const iconify = wrapper.findComponent(IconifyIcon)
    expect(iconify.props('flip')).toBe(expected)
  })

  // Props: hoverIcon
  it('should switch icon on hover when hoverIcon is set', async () => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home', hoverIcon: 'mdi:star' },
      global,
    })
    const iconify = wrapper.findComponent(IconifyIcon)
    expect(iconify.props('icon')).toBe('mdi:home')
    await wrapper.trigger('mouseenter')
    expect(iconify.props('icon')).toBe('mdi:star')
  })

  // Events: load
  it('should emit load event', () => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:home' },
      global,
    })
    const iconify = wrapper.findComponent(IconifyIcon)
    ;(iconify.vm.$.vnode.props?.onLoad as () => void)()
    expect(wrapper.emitted().load).toHaveLength(1)
  })

  // Events: error
  it('should emit error event with icon name', () => {
    const wrapper = mount(Icon, {
      props: { icon: 'mdi:invalid' },
      global,
    })
    const iconify = wrapper.findComponent(IconifyIcon)
    ;(iconify.vm.$.vnode.props?.onError as () => void)()
    expect(wrapper.emitted().error).toHaveLength(1)
    expect(wrapper.emitted().error![0]).toEqual(['mdi:invalid'])
  })

  // Events: error with non-string icon
  it('should emit error event with unknown when icon is not string', () => {
    const wrapper = mount(Icon, {
      props: { icon: { body: '<path/>' } as any },
      global,
    })
    const iconify = wrapper.findComponent(IconifyIcon)
    ;(iconify.vm.$.vnode.props?.onError as () => void)()
    expect(wrapper.emitted().error![0]).toEqual(['unknown'])
  })
})
