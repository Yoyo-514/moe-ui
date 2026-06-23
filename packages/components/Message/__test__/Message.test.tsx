import { defineComponent, h, type App } from 'vue'

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { emitAfterLeave, flushRender } from '@moe-ui/test-utils'

import { MESSAGE_GAP, MESSAGE_HEIGHT } from '../src/constants'
import Message from '../src/Message.vue'
import { MoeMessage, messageInstances } from '../src/method'

describe('Message.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    MoeMessage.closeAll()
    document.body.innerHTML = ''
  })

  it('renders text, type, placement and close button', async () => {
    const wrapper = mount(Message, {
      props: {
        id: 'message-test',
        message: '保存成功',
        type: 'success',
        placement: 'bottom',
        offset: 32,
        zIndex: 2100,
        duration: 0,
        showClose: true,
      },
    })

    await flushRender()

    expect(wrapper.get('.moe-message').attributes('id')).toBe('message-test')
    expect(wrapper.text()).toContain('保存成功')
    expect(wrapper.get('.moe-message').classes()).toContain('moe-message--success')
    expect(wrapper.get('.moe-message').classes()).toContain('is-bottom')
    expect(wrapper.get('.moe-message').attributes('style')).toContain('bottom: 32px')
    expect(wrapper.get('.moe-message').attributes('style')).toContain('z-index: 2100')
    expect(wrapper.find('.moe-message__close').exists()).toBe(true)
  })

  it('renders function message and keeps duration 0 visible', async () => {
    const wrapper = mount(Message, {
      props: {
        id: 'message-function',
        message: () => h('span', { class: 'message-function' }, '函数内容'),
        type: 'info',
        placement: 'top',
        offset: 20,
        zIndex: 2101,
        duration: 0,
      },
    })

    await vi.advanceTimersByTimeAsync(1000)
    await flushRender()

    expect(wrapper.get('.message-function').text()).toBe('函数内容')
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('normalizes error type to danger and renders vnode message', async () => {
    const wrapper = mount(Message, {
      props: {
        id: 'message-vnode',
        message: h('strong', { class: 'message-vnode' }, 'VNode 内容'),
        type: 'error',
        placement: 'top',
        offset: 20,
        zIndex: 2102,
        duration: 0,
      },
    })

    await flushRender()

    expect(wrapper.get('.moe-message').classes()).toContain('moe-message--danger')
    expect(wrapper.get('.message-vnode').text()).toBe('VNode 内容')
  })

  it('emits close by button click and by duration timeout', async () => {
    const wrapper = mount(Message, {
      props: {
        id: 'message-close',
        message: '可关闭',
        type: 'info',
        placement: 'top',
        offset: 20,
        zIndex: 2103,
        duration: 0,
        showClose: true,
      },
    })

    await wrapper.get('.moe-message__close').trigger('click')
    await flushRender()
    expect(wrapper.emitted('close')).toHaveLength(1)

    const timeoutWrapper = mount(Message, {
      props: {
        id: 'message-timeout',
        message: '自动关闭',
        type: 'info',
        placement: 'top',
        offset: 20,
        zIndex: 2104,
        duration: 100,
      },
    })

    await vi.advanceTimersByTimeAsync(100)
    await flushRender()
    expect(timeoutWrapper.emitted('close')).toHaveLength(1)
  })

  it('emits destroy after leave transition finishes', async () => {
    const wrapper = mount(Message, {
      props: {
        id: 'message-destroy',
        message: '动画结束后销毁',
        type: 'info',
        placement: 'top',
        offset: 20,
        zIndex: 2105,
        duration: 0,
        showClose: true,
      },
    })

    await wrapper.get('.moe-message__close').trigger('click')
    emitAfterLeave(wrapper)
    await flushRender()

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('destroy')).toHaveLength(1)
  })

  it('pauses timer on mouseenter and restarts on mouseleave', async () => {
    const wrapper = mount(Message, {
      props: {
        id: 'message-hover',
        message: '悬停暂停',
        type: 'info',
        placement: 'top',
        offset: 20,
        zIndex: 2106,
        duration: 100,
      },
    })

    await wrapper.get('.moe-message').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(100)
    await flushRender()
    expect(wrapper.emitted('close')).toBeUndefined()

    await wrapper.get('.moe-message').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(100)
    await flushRender()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

describe('MoeMessage method', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    MoeMessage.closeAll()
    document.body.innerHTML = ''
    messageInstances.splice(0)
  })

  it('returns a noop handler without document in non-browser environment', () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'document')

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    })

    try {
      const handler = MoeMessage('服务端提示')

      expect(() => handler.close()).not.toThrow()
      expect(messageInstances).toHaveLength(0)
    } finally {
      if (descriptor) {
        Object.defineProperty(globalThis, 'document', descriptor)
      }
    }
  })

  it('creates default message without params', async () => {
    const handler = MoeMessage()
    await flushRender()

    expect(document.body.querySelector('.moe-message')).not.toBeNull()
    expect(document.body.querySelector('.moe-message')?.className).toContain('moe-message--info')

    handler.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()
    expect(messageInstances).toHaveLength(0)
  })

  it('creates message from string and supports manual close', async () => {
    const handler = MoeMessage('普通提示')
    await flushRender()

    expect(document.body.querySelector('.moe-message')?.textContent).toContain('普通提示')
    expect(messageInstances).toHaveLength(1)

    handler.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    expect(messageInstances).toHaveLength(0)
    expect(document.body.querySelector('.moe-message')).toBeNull()
  })

  it('supports type shortcuts, error alias and options id', async () => {
    MoeMessage.primary({ id: 'primary-message', message: '主色提示', duration: 0 })
    MoeMessage.error({ id: 'error-message', message: '错误提示', duration: 0 })
    await flushRender()

    expect(document.body.querySelector('#primary-message')?.className).toContain(
      'moe-message--primary'
    )
    expect(document.body.querySelector('#error-message')?.className).toContain(
      'moe-message--danger'
    )
  })

  it('stacks multiple messages and updates offset after closing one', async () => {
    const first = MoeMessage({ id: 'first', message: '第一条', duration: 0, offset: 30 })
    MoeMessage({ id: 'second', message: '第二条', duration: 0, offset: 30 })
    await flushRender()

    expect(document.body.querySelector('#first')?.getAttribute('style')).toContain('top: 30px')
    expect(document.body.querySelector('#second')?.getAttribute('style')).toContain(
      `top: ${30 + MESSAGE_HEIGHT + MESSAGE_GAP}px`
    )

    first.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    expect(document.body.querySelector('#second')?.getAttribute('style')).toContain('top: 30px')
  })

  it('supports bottom placement, onClose, closeAll and vnode params', async () => {
    const onClose = vi.fn()
    MoeMessage({
      id: 'bottom-message',
      message: h('span', { class: 'bottom-content' }, '底部提示'),
      placement: 'bottom',
      duration: 0,
      offset: 40,
      zIndex: 3100,
      onClose,
    })
    MoeMessage.success(h('span', { class: 'vnode-shortcut' }, 'VNode shortcut'))
    await flushRender()

    expect(document.body.querySelector('#bottom-message')?.getAttribute('style')).toContain(
      'bottom: 40px'
    )
    expect(document.body.querySelector('#bottom-message')?.getAttribute('style')).toContain(
      'z-index: 3100'
    )
    expect(document.body.querySelector('.bottom-content')?.textContent).toBe('底部提示')
    expect(document.body.querySelector('.vnode-shortcut')?.textContent).toBe('VNode shortcut')

    MoeMessage.closeAll()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    expect(onClose).toHaveBeenCalledOnce()
    expect(messageInstances).toHaveLength(0)
  })

  it('installs $message on app global properties', () => {
    const app = { config: { globalProperties: {} } } as App

    MoeMessage.install(app)

    expect(app.config.globalProperties.$message).toBe(MoeMessage)
  })

  it('supports calling this.$message from component instance after install', async () => {
    const Demo = defineComponent({
      methods: {
        open() {
          this.$message.success('实例全局方法')
        },
      },
      template: '<button type="button" @click="open">open</button>',
    })

    const wrapper = mount(Demo, {
      global: {
        plugins: [MoeMessage],
      },
    })

    await wrapper.get('button').trigger('click')
    await flushRender()

    expect(document.body.querySelector('.moe-message')?.textContent).toContain('实例全局方法')
    expect(document.body.querySelector('.moe-message')?.className).toContain('moe-message--success')
  })
})
