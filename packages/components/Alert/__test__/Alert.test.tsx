import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import Alert from '../src/Alert.vue'
import type { AlertInstance } from '../src/types'

describe('Alert.vue', () => {
  it('should render title and default info type', () => {
    const wrapper = mount(Alert, {
      props: { title: '提示标题' },
    })

    expect(wrapper.get('.moe-alert').classes()).toContain('moe-alert')
    expect(wrapper.get('.moe-alert').classes()).toContain('moe-alert--info')
    expect(wrapper.get('.moe-alert').classes()).toContain('is-light')
    expect(wrapper.get('.moe-alert__title').text()).toBe('提示标题')
    expect(wrapper.get('.moe-alert').attributes('role')).toBe('alert')
  })

  it.each(['success', 'warning', 'info', 'danger'] as const)(
    'should render %s type class',
    (type) => {
      const wrapper = mount(Alert, {
        props: { title: type, type },
      })

      expect(wrapper.get('.moe-alert').classes()).toContain(`moe-alert--${type}`)
    }
  )

  it('should render dark effect and center class', () => {
    const wrapper = mount(Alert, {
      props: { title: '居中提示', effect: 'dark', center: true },
    })

    expect(wrapper.get('.moe-alert').classes()).toContain('is-dark')
    expect(wrapper.get('.moe-alert').classes()).toContain('is-center')
  })

  it('should render description from prop', () => {
    const wrapper = mount(Alert, {
      props: {
        title: '标题',
        description: '详细说明',
      },
    })

    expect(wrapper.get('.moe-alert').classes()).toContain('is-with-description')
    expect(wrapper.get('.moe-alert__description').text()).toBe('详细说明')
  })

  it('should render description without title', () => {
    const wrapper = mount(Alert, {
      props: {
        description: '只有描述内容',
      },
    })

    expect(wrapper.find('.moe-alert__title').exists()).toBe(false)
    expect(wrapper.get('.moe-alert__description').text()).toBe('只有描述内容')
  })

  it('should render title and default slots', () => {
    const wrapper = mount(Alert, {
      slots: {
        title: () => '插槽标题',
        default: () => '插槽描述',
      },
    })

    expect(wrapper.get('.moe-alert__title').text()).toBe('插槽标题')
    expect(wrapper.get('.moe-alert__description').text()).toBe('插槽描述')
  })

  it('should render type icon when showIcon is true', () => {
    const wrapper = mount(Alert, {
      props: {
        type: 'success',
        title: '成功提示',
        showIcon: true,
      },
      global: { stubs: ['MoeIcon'] },
    })

    expect(wrapper.get('moe-icon-stub').attributes('icon')).toBe('mingcute:check-circle-line')
  })

  it('should render custom icon slot', () => {
    const wrapper = mount(Alert, {
      props: { title: '自定义图标提示', closable: false },
      slots: {
        icon: () => <span class="custom-alert-icon">!</span>,
      },
    })

    expect(wrapper.get('.moe-alert__icon').text()).toBe('!')
    expect(wrapper.findComponent({ name: 'MoeIcon' }).exists()).toBe(false)
  })

  it('should close alert and emit close event', async () => {
    const closeSpy = vi.fn()
    const wrapper = mount(Alert, {
      props: {
        title: '可关闭提示',
        onClose: closeSpy,
      },
    })

    await wrapper.get('.moe-alert__close').trigger('click')

    expect(closeSpy).toHaveBeenCalledOnce()
    expect(wrapper.find('.moe-alert').exists()).toBe(false)
  })

  it('should expose open and close methods', async () => {
    const wrapper = mount(Alert, {
      props: { title: '实例控制提示' },
    })
    const alertVm = wrapper.vm as unknown as AlertInstance

    alertVm.close()
    await nextTick()
    expect(wrapper.find('.moe-alert').exists()).toBe(false)

    alertVm.open()
    await nextTick()
    expect(wrapper.find('.moe-alert').exists()).toBe(true)
  })

  it('should render close text', () => {
    const wrapper = mount(Alert, {
      props: {
        title: '文字关闭',
        closeText: '知道了',
      },
    })

    expect(wrapper.get('.moe-alert__close').text()).toBe('知道了')
  })

  it('should hide close button when closable is false', () => {
    const wrapper = mount(Alert, {
      props: {
        title: '不可关闭',
        closable: false,
      },
    })

    expect(wrapper.find('.moe-alert__close').exists()).toBe(false)
  })
})
