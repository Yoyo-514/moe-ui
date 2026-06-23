import { h, markRaw, type App } from 'vue'

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { emitAfterLeave, flushRender } from '@moe-ui/test-utils'

import { NOTIFICATION_GAP, NOTIFICATION_HEIGHT } from '../src/constants'
import { MoeNotification, notificationInstances } from '../src/method'
import Notification from '../src/Notification.vue'

describe('Notification.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    MoeNotification.closeAll()
    document.body.innerHTML = ''
  })

  it('renders defaults and keeps duration 0 visible', async () => {
    const wrapper = mount(Notification, {
      props: {
        id: 'notification-defaults',
        message: '默认通知',
        zIndex: 3099,
        duration: 0,
      },
    })

    await vi.advanceTimersByTimeAsync(1000)
    await flushRender()

    const notification = wrapper.get('.moe-notification')
    expect(notification.classes()).toContain('moe-notification--info')
    expect(notification.classes()).toContain('is-top-right')
    expect(notification.attributes('style')).toContain('top: 16px')
    expect(notification.attributes('style')).toContain('right: 16px')
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('renders title, message, type, position, close button and style', async () => {
    const wrapper = mount(Notification, {
      props: {
        id: 'notification-test',
        title: '系统通知',
        message: '保存成功',
        type: 'success',
        position: 'bottom-left',
        offset: 32,
        zIndex: 3100,
        duration: 0,
        showClose: true,
      },
    })

    await flushRender()

    const notification = wrapper.get('.moe-notification')
    expect(notification.attributes('id')).toBe('notification-test')
    expect(notification.attributes('role')).toBe('alert')
    expect(notification.classes()).toContain('moe-notification--success')
    expect(notification.classes()).toContain('is-bottom-left')
    expect(notification.classes()).toContain('is-left')
    expect(notification.attributes('style')).toContain('bottom: 32px')
    expect(notification.attributes('style')).toContain('left: 16px')
    expect(notification.attributes('style')).toContain('z-index: 3100')
    expect(wrapper.get('.moe-notification__title').text()).toBe('系统通知')
    expect(wrapper.get('.moe-notification__message').text()).toBe('保存成功')
    expect(wrapper.find('.moe-notification__close').exists()).toBe(true)
  })

  it('supports vnode and function message and normalizes error to danger', async () => {
    const vnodeWrapper = mount(Notification, {
      props: {
        id: 'notification-vnode',
        message: h('strong', { class: 'notification-vnode' }, 'VNode 内容'),
        type: 'error',
        position: 'top-right',
        offset: 16,
        zIndex: 3101,
        duration: 0,
      },
    })
    const functionWrapper = mount(Notification, {
      props: {
        id: 'notification-function',
        message: () => h('span', { class: 'notification-function' }, '函数内容'),
        type: 'info',
        position: 'top-right',
        offset: 16,
        zIndex: 3102,
        duration: 0,
      },
    })

    await flushRender()

    expect(vnodeWrapper.get('.moe-notification').classes()).toContain('moe-notification--danger')
    expect(vnodeWrapper.get('.notification-vnode').text()).toBe('VNode 内容')
    expect(functionWrapper.get('.notification-function').text()).toBe('函数内容')
  })

  it('uses custom icon, supports hidden icon and hidden close button', async () => {
    const CustomIcon = markRaw({
      render: () => h('span', { class: 'custom-icon' }, '图'),
    })
    const iconWrapper = mount(Notification, {
      props: {
        id: 'notification-icon',
        message: '自定义图标',
        icon: CustomIcon,
        position: 'top-right',
        zIndex: 3103,
        duration: 0,
      },
    })
    const hiddenWrapper = mount(Notification, {
      props: {
        id: 'notification-hidden',
        message: '隐藏图标和关闭按钮',
        icon: '',
        showClose: false,
        position: 'top-right',
        zIndex: 3104,
        duration: 0,
      },
    })

    await flushRender()

    expect(iconWrapper.get('.custom-icon').text()).toBe('图')
    expect(hiddenWrapper.find('.moe-notification__icon').exists()).toBe(false)
    expect(hiddenWrapper.find('.moe-notification__close').exists()).toBe(false)
  })

  it('emits click from notification body and close without bubbling click', async () => {
    const wrapper = mount(Notification, {
      props: {
        id: 'notification-click',
        message: '点击通知',
        position: 'top-right',
        zIndex: 3105,
        duration: 0,
        onClick: vi.fn(),
      },
    })

    await wrapper.get('.moe-notification').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)

    await wrapper.get('.moe-notification__close').trigger('click')
    await flushRender()

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('auto closes, pauses on mouseenter and restarts on mouseleave', async () => {
    const wrapper = mount(Notification, {
      props: {
        id: 'notification-timer',
        message: '自动关闭',
        position: 'top-right',
        zIndex: 3106,
        duration: 100,
      },
    })

    await wrapper.get('.moe-notification').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(100)
    await flushRender()
    expect(wrapper.emitted('close')).toBeUndefined()

    await wrapper.get('.moe-notification').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(100)
    await flushRender()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('exposes visible and close and ignores repeated close', async () => {
    const wrapper = mount(Notification, {
      props: {
        id: 'notification-expose',
        message: '暴露方法',
        position: 'top-right',
        zIndex: 3107,
        duration: 0,
      },
    })

    await flushRender()
    expect(wrapper.vm.visible).toBe(true)

    wrapper.vm.close()
    wrapper.vm.close()
    emitAfterLeave(wrapper)
    await flushRender()

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('destroy')).toHaveLength(1)
  })
})

describe('MoeNotification method', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    MoeNotification.closeAll()
    document.body.innerHTML = ''
    notificationInstances.splice(0)
  })

  it('returns a noop handler without document in non-browser environment', () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'document')

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    })

    try {
      const handler = MoeNotification('服务端通知')

      expect(() => handler.close()).not.toThrow()
      expect(notificationInstances).toHaveLength(0)
    } finally {
      if (descriptor) {
        Object.defineProperty(globalThis, 'document', descriptor)
      }
    }
  })

  it('creates default notification without params', async () => {
    const handler = MoeNotification()
    await flushRender()

    expect(document.body.querySelector('.moe-notification')).not.toBeNull()
    expect(document.body.querySelector('.moe-notification')?.className).toContain(
      'moe-notification--info'
    )

    handler.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()
    expect(notificationInstances).toHaveLength(0)
  })

  it('creates notification from string and supports manual close', async () => {
    const handler = MoeNotification('普通通知')
    await flushRender()

    expect(document.body.querySelector('.moe-notification')?.textContent).toContain('普通通知')
    expect(notificationInstances).toHaveLength(1)

    handler.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    expect(notificationInstances).toHaveLength(0)
    expect(document.body.querySelector('.moe-notification')).toBeNull()
  })

  it('supports type shortcuts, error alias, id and onClick', async () => {
    const onClick = vi.fn()
    MoeNotification.primary({ id: 'primary-notification', message: '主色通知', duration: 0 })
    MoeNotification.error({
      id: 'error-notification',
      message: '错误通知',
      duration: 0,
      onClick,
    })
    await flushRender()

    expect(document.body.querySelector('#primary-notification')?.className).toContain(
      'moe-notification--primary'
    )
    expect(document.body.querySelector('#error-notification')?.className).toContain(
      'moe-notification--danger'
    )

    document.body.querySelector<HTMLElement>('#error-notification')?.click()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('stacks notifications in same position and keeps positions independent', async () => {
    const first = MoeNotification({
      id: 'first-notification',
      message: '第一条',
      duration: 0,
      offset: 30,
      position: 'top-right',
    })
    MoeNotification({
      id: 'second-notification',
      message: '第二条',
      duration: 0,
      offset: 30,
      position: 'top-right',
    })
    MoeNotification({
      id: 'left-notification',
      message: '左侧',
      duration: 0,
      offset: 30,
      position: 'top-left',
    })
    await flushRender()

    expect(document.body.querySelector('#first-notification')?.getAttribute('style')).toContain(
      'top: 30px'
    )
    expect(document.body.querySelector('#second-notification')?.getAttribute('style')).toContain(
      `top: ${30 + NOTIFICATION_HEIGHT + NOTIFICATION_GAP}px`
    )
    expect(document.body.querySelector('#left-notification')?.getAttribute('style')).toContain(
      'top: 30px'
    )
    expect(document.body.querySelector('#left-notification')?.getAttribute('style')).toContain(
      'left: 16px'
    )

    first.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    expect(document.body.querySelector('#second-notification')?.getAttribute('style')).toContain(
      'top: 30px'
    )
  })

  it('keeps each notification base offset when mixed offsets are closed', async () => {
    const normal = MoeNotification({
      id: 'normal-offset-notification',
      message: '普通位置',
      duration: 0,
      offset: 16,
      position: 'top-right',
    })
    MoeNotification({
      id: 'shifted-offset-notification',
      message: '偏移位置',
      duration: 0,
      offset: 80,
      position: 'top-right',
    })
    await flushRender()

    expect(
      document.body.querySelector('#normal-offset-notification')?.getAttribute('style')
    ).toContain('top: 16px')
    expect(
      document.body.querySelector('#shifted-offset-notification')?.getAttribute('style')
    ).toContain(`top: ${16 + NOTIFICATION_HEIGHT + NOTIFICATION_GAP}px`)

    normal.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    expect(
      document.body.querySelector('#shifted-offset-notification')?.getAttribute('style')
    ).toContain('top: 80px')

    MoeNotification.closeAll()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    const shifted = MoeNotification({
      id: 'shifted-first-notification',
      message: '先打开偏移位置',
      duration: 0,
      offset: 80,
      position: 'top-right',
    })
    MoeNotification({
      id: 'normal-after-shifted-notification',
      message: '后打开普通位置',
      duration: 0,
      offset: 16,
      position: 'top-right',
    })
    await flushRender()

    expect(
      document.body.querySelector('#shifted-first-notification')?.getAttribute('style')
    ).toContain('top: 80px')
    expect(
      document.body.querySelector('#normal-after-shifted-notification')?.getAttribute('style')
    ).toContain(`top: ${80 + NOTIFICATION_HEIGHT + NOTIFICATION_GAP}px`)

    shifted.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    expect(
      document.body.querySelector('#normal-after-shifted-notification')?.getAttribute('style')
    ).toContain('top: 16px')
  })

  it('supports bottom position, onClose, closeAll and vnode params', async () => {
    const onClose = vi.fn()
    MoeNotification({
      id: 'bottom-notification',
      title: '底部通知',
      message: h('span', { class: 'bottom-content' }, '底部内容'),
      position: 'bottom-left',
      duration: 0,
      offset: 40,
      zIndex: 4100,
      onClose,
    })
    MoeNotification.success(h('span', { class: 'vnode-shortcut' }, 'VNode shortcut'))
    await flushRender()

    expect(document.body.querySelector('#bottom-notification')?.getAttribute('style')).toContain(
      'bottom: 40px'
    )
    expect(document.body.querySelector('#bottom-notification')?.getAttribute('style')).toContain(
      'left: 16px'
    )
    expect(document.body.querySelector('#bottom-notification')?.getAttribute('style')).toContain(
      'z-index: 4100'
    )
    expect(document.body.querySelector('.bottom-content')?.textContent).toBe('底部内容')
    expect(document.body.querySelector('.vnode-shortcut')?.textContent).toBe('VNode shortcut')

    MoeNotification.closeAll()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    expect(onClose).toHaveBeenCalledOnce()
    expect(notificationInstances).toHaveLength(0)
  })

  it('installs $notification and supports calling from component instance', async () => {
    const app = { config: { globalProperties: {} } } as App
    MoeNotification.install(app)
    expect(app.config.globalProperties.$notification).toBe(MoeNotification)

    const Demo = {
      template:
        '<button type="button" @click="$notification.success(\'实例全局通知\')">open</button>',
    }
    const wrapper = mount(Demo, {
      global: {
        plugins: [MoeNotification],
      },
    })

    await wrapper.get('button').trigger('click')
    await flushRender()

    expect(document.body.querySelector('.moe-notification')?.textContent).toContain('实例全局通知')
    expect(document.body.querySelector('.moe-notification')?.className).toContain(
      'moe-notification--success'
    )
  })
})
