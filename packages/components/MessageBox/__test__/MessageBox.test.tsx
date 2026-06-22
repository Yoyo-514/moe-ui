import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, markRaw, type App } from 'vue'
import { emitAfterLeave, flushRender } from '@moe-ui/test-utils'

import { resetZIndex } from '@moe-ui/hooks'
import MessageBox from '../src/MessageBox.vue'
import { MESSAGE_BOX_CLOSE_ICON, MESSAGE_BOX_DEFAULT_OPTIONS } from '../src/constants'
import { MoeMessageBox, messageBoxInstances } from '../src/method'
import type { MessageBoxProps } from '../src/types'

const createProps = (options: Partial<MessageBoxProps> = {}): MessageBoxProps => ({
  ...MESSAGE_BOX_DEFAULT_OPTIONS,
  id: 'message-box-test',
  closeIcon: MESSAGE_BOX_CLOSE_ICON,
  customStyle: {},
  zIndex: 3001,
  ...options,
})

const clickConfirm = async () => {
  const buttons = [...document.body.querySelectorAll<HTMLButtonElement>('.moe-button')]
  await buttons[buttons.length - 1]?.click()
  await flushRender()
}

const clickCancel = async () => {
  const button = document.body.querySelector<HTMLButtonElement>('.moe-button')
  await button?.click()
  await flushRender()
}

describe('MessageBox.vue', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('renders dialog semantics, title, message, icon, classes and buttons', async () => {
    const wrapper = mount(MessageBox, {
      props: createProps({
        title: '删除确认',
        message: '确定删除该文件吗？',
        type: 'warning',
        showCancelButton: true,
        center: true,
        roundButton: true,
        buttonSize: 'small',
        customClass: 'custom-message-box',
        customStyle: { width: '480px' },
      }),
    })

    await flushRender()

    const dialog = wrapper.get('.moe-message-box')
    expect(dialog.attributes('role')).toBe('dialog')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.classes()).toContain('moe-message-box--warning')
    expect(dialog.classes()).toContain('is-center')
    expect(dialog.classes()).toContain('is-round-button')
    expect(dialog.classes()).toContain('custom-message-box')
    expect(dialog.attributes('style')).toContain('width: 480px')
    expect(wrapper.text()).toContain('删除确认')
    expect(wrapper.text()).toContain('确定删除该文件吗？')
    expect(wrapper.find('.moe-message-box__status-icon').exists()).toBe(true)
    expect(wrapper.findAll('.moe-button')).toHaveLength(2)
    expect(wrapper.find('.moe-button--small').exists()).toBe(true)
  })

  it('renders vnode/function message and custom icon components', async () => {
    const CustomIcon = markRaw({ render: () => h('span', { class: 'custom-status-icon' }, '图') })
    const CloseIcon = markRaw({ render: () => h('span', { class: 'custom-close-icon' }, '关') })
    const wrapper = mount(MessageBox, {
      props: createProps({
        title: '自定义内容',
        message: () => h('strong', { class: 'function-message' }, '函数消息'),
        icon: CustomIcon,
        closeIcon: CloseIcon,
      }),
    })

    await flushRender()

    expect(wrapper.get('.function-message').text()).toBe('函数消息')
    expect(wrapper.get('.custom-status-icon').text()).toBe('图')
    expect(wrapper.get('.custom-close-icon').text()).toBe('关')
  })

  it('emits confirm, cancel and normalized close actions', async () => {
    const wrapper = mount(MessageBox, {
      props: createProps({ showCancelButton: true }),
    })

    await wrapper.findAll('.moe-button')[1].trigger('click')
    expect(wrapper.emitted('action')?.[0]).toEqual(['confirm', ''])

    const cancelWrapper = mount(MessageBox, {
      props: createProps({ showCancelButton: true }),
    })
    await cancelWrapper.findAll('.moe-button')[0].trigger('click')
    expect(cancelWrapper.emitted('action')?.[0]).toEqual(['cancel', ''])

    const closeWrapper = mount(MessageBox, {
      props: createProps({ distinguishCancelAndClose: true }),
    })
    await closeWrapper.get('.moe-message-box__close').trigger('click')
    expect(closeWrapper.emitted('action')?.[0]).toEqual(['close', ''])
  })

  it('respects modal, escape and hash change close switches', async () => {
    const wrapper = mount(MessageBox, {
      props: createProps({
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
      }),
      attachTo: document.body,
    })

    await wrapper.get('.moe-message-box__wrapper').trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    await flushRender()

    expect(wrapper.emitted('action')).toBeUndefined()

    await wrapper.setProps({
      closeOnClickModal: true,
      closeOnPressEscape: true,
      closeOnHashChange: true,
      distinguishCancelAndClose: true,
    })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushRender()
    expect(wrapper.emitted('action')?.[0]).toEqual(['close', ''])
  })

  it('does not close by wrapper click when modal is disabled', async () => {
    const wrapper = mount(MessageBox, {
      props: createProps({ modal: false, modalClass: 'transparent-modal' }),
    })

    await flushRender()
    expect(wrapper.get('.moe-message-box__wrapper').classes()).toContain('is-no-mask')
    expect(wrapper.get('.moe-message-box__wrapper').classes()).toContain('transparent-modal')

    await wrapper.get('.moe-message-box__wrapper').trigger('click')
    expect(wrapper.emitted('action')).toBeUndefined()
  })

  it('runs beforeClose and waits for done before closing', async () => {
    const beforeClose = vi.fn()
    const wrapper = mount(MessageBox, {
      props: createProps({ beforeClose }),
    })

    await wrapper.get('.moe-button').trigger('click')
    expect(beforeClose).toHaveBeenCalledOnce()
    expect(wrapper.emitted('action')).toBeUndefined()

    const done = beforeClose.mock.calls[0][2]
    done()
    expect(wrapper.emitted('action')?.[0]).toEqual(['confirm', ''])
  })

  it('locks body scroll while mounted and restores it on unmount', () => {
    document.body.style.overflow = 'auto'
    const wrapper = mount(MessageBox, {
      props: createProps({ modal: true, lockScroll: true }),
      attachTo: document.body,
    })

    expect(document.body.style.overflow).toBe('hidden')
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('auto')
  })

  it('validates prompt input by pattern and validator', async () => {
    const patternWrapper = mount(MessageBox, {
      props: createProps({
        showInput: true,
        inputValue: '123',
        inputPlaceholder: '请输入名称',
        inputPattern: /^[a-z]+$/,
      }),
    })

    await flushRender()
    expect(patternWrapper.get('input').element.value).toBe('123')
    expect(patternWrapper.get('input').attributes('placeholder')).toBe('请输入名称')

    await patternWrapper.get('.moe-button').trigger('click')
    await flushRender()
    expect(patternWrapper.emitted('action')).toBeUndefined()
    expect(patternWrapper.text()).toContain('输入内容不合法')

    const invalidValidator = vi.fn(() => '请输入 moe')
    const invalidWrapper = mount(MessageBox, {
      props: createProps({
        showInput: true,
        inputValue: 'cat',
        inputPattern: /^[a-z]+$/,
        inputValidator: invalidValidator,
      }),
    })

    await flushRender()
    await invalidWrapper.get('.moe-button').trigger('click')
    await flushRender()
    expect(invalidValidator).toHaveBeenCalledWith('cat')
    expect(invalidWrapper.text()).toContain('请输入 moe')
    expect(invalidWrapper.emitted('action')).toBeUndefined()

    const validValidator = vi.fn(() => true)
    const validWrapper = mount(MessageBox, {
      props: createProps({
        showInput: true,
        inputValue: 'moe',
        inputPattern: /^[a-z]+$/,
        inputValidator: validValidator,
      }),
    })

    await flushRender()
    await validWrapper.get('.moe-button').trigger('click')
    await flushRender()
    expect(validValidator).toHaveBeenCalledWith('moe')
    expect(validWrapper.emitted('action')?.[0]).toEqual(['confirm', 'moe'])
  })

  it('renders textarea prompt from inputType and async validator rejection message', async () => {
    const wrapper = mount(MessageBox, {
      props: createProps({
        showInput: true,
        inputType: 'textarea',
        inputValidator: () => Promise.reject(new Error('异步校验失败')),
      }),
    })

    await flushRender()
    expect(wrapper.find('textarea').exists()).toBe(true)

    await wrapper.get('.moe-button').trigger('click')
    await flushRender()
    expect(wrapper.text()).toContain('异步校验失败')
    expect(wrapper.emitted('action')).toBeUndefined()
  })

  it('emits destroy after leave transition finishes', async () => {
    const wrapper = mount(MessageBox, {
      props: createProps(),
    })

    await wrapper.get('.moe-button').trigger('click')
    emitAfterLeave(wrapper)
    await flushRender()

    expect(wrapper.emitted('destroy')).toHaveLength(1)
  })
})

describe('MoeMessageBox method', () => {
  afterEach(() => {
    MoeMessageBox.closeAll()
    messageBoxInstances.splice(0)
    document.body.style.overflow = ''
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('rejects safely without document', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'document')
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    })

    await expect(MoeMessageBox('服务端弹框')).rejects.toBe('close')

    if (descriptor) Object.defineProperty(globalThis, 'document', descriptor)
  })

  it('creates alert and resolves confirm action', async () => {
    const promise = MoeMessageBox.alert('保存成功', '提示', { type: 'success' })
    await flushRender()

    expect(document.body.querySelector('.moe-message-box')?.textContent).toContain('保存成功')
    expect(document.body.querySelector('.moe-message-box')?.textContent).toContain('提示')
    expect(document.body.querySelector('.moe-message-box')?.className).toContain(
      'moe-message-box--success'
    )

    await clickConfirm()
    await expect(promise).resolves.toBe('confirm')
  })

  it('creates confirm and rejects cancel action', async () => {
    const promise = MoeMessageBox.confirm('确定删除吗？', { cancelButtonText: '不了' })
    await flushRender()

    expect(document.body.textContent).toContain('不了')
    await clickCancel()
    await expect(promise).rejects.toBe('cancel')
  })

  it('creates prompt and resolves value with callback', async () => {
    const callback = vi.fn()
    const promise = MoeMessageBox.prompt('请输入名称', '新建', {
      inputValue: 'moe',
      callback,
    })
    await flushRender()

    expect(document.body.querySelector('input')?.getAttribute('value')).toBe('moe')
    await clickConfirm()

    await expect(promise).resolves.toEqual({ action: 'confirm', value: 'moe' })
    expect(callback).toHaveBeenCalledWith('moe', 'confirm')
  })

  it('uses useZIndex to assign incremental z-index and respects custom zIndex', async () => {
    resetZIndex(3000)

    MoeMessageBox({ message: '第一条层级' }).catch(() => undefined)
    MoeMessageBox({ message: '第二条层级' }).catch(() => undefined)
    MoeMessageBox({ message: '自定义层级', zIndex: 5000 }).catch(() => undefined)
    await flushRender()

    const overlays = [...document.body.querySelectorAll<HTMLElement>('.moe-overlay')]
    expect(overlays[0].style.zIndex).toBe('3001')
    expect(overlays[1].style.zIndex).toBe('3002')
    expect(overlays[2].style.zIndex).toBe('5000')
  })

  it('moves focus into message box so Enter confirms instead of retriggering opener', async () => {
    const promise = MoeMessageBox.confirm('重复触发', '提示')
    await flushRender()

    const buttons = [...document.body.querySelectorAll<HTMLButtonElement>('.moe-button')]
    const confirmButton = buttons[buttons.length - 1]
    expect(document.activeElement).toBe(confirmButton)

    confirmButton?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await expect(promise).resolves.toBe('confirm')
  })

  it('moves focus when opened from global confirm method', async () => {
    const app = { config: { globalProperties: {} } } as App
    MoeMessageBox.install(app)

    const promise = app.config.globalProperties.$confirm('全局方法触发', '提示')
    await flushRender()

    const buttons = [...document.body.querySelectorAll<HTMLButtonElement>('.moe-button')]
    const confirmButton = buttons[buttons.length - 1]
    expect(document.activeElement).toBe(confirmButton)

    confirmButton?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await expect(promise).resolves.toBe('confirm')
  })

  it('supports closeAll and global install aliases', async () => {
    const promise = MoeMessageBox({ message: '第一条', showCancelButton: true }).catch(
      () => undefined
    )
    await flushRender()

    expect(messageBoxInstances).toHaveLength(1)
    MoeMessageBox.closeAll()
    await promise
    await flushRender()

    expect(messageBoxInstances.every((item) => item.vm.exposed?.visible === false)).toBe(true)

    const app = { config: { globalProperties: {} } } as App
    MoeMessageBox.install(app)
    expect(app.config.globalProperties.$messageBox).toBe(MoeMessageBox)
    expect(app.config.globalProperties.$msgbox).toBe(MoeMessageBox)
    expect(app.config.globalProperties.$alert).toBe(MoeMessageBox.alert)
    expect(app.config.globalProperties.$confirm).toBe(MoeMessageBox.confirm)
    expect(app.config.globalProperties.$prompt).toBe(MoeMessageBox.prompt)
  })
})
