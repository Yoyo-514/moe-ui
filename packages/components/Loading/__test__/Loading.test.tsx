import { createApp, h, ref } from 'vue'

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { resetZIndex } from '@moe-ui/hooks'

import { emitAfterLeave, flushRender } from '@moe-ui/test-utils'

import { MoeLoading } from '../index'
import { loadingDirective } from '../src/directive'
import Loading from '../src/Loading.vue'
import { resolveTarget, service } from '../src/method'

describe('Loading.vue', () => {
  it('renders spinner, string text, background, custom class and fullscreen state', async () => {
    const wrapper = mount(Loading, {
      props: {
        visible: true,
        text: '加载中',
        spinner: 'mingcute:loading-line',
        background: 'rgba(1, 2, 3, 0.4)',
        customClass: 'custom-loading',
        fullscreen: true,
        zIndex: 3000,
      },
    })

    await flushRender()

    const overlay = wrapper.get('.moe-overlay')
    expect(overlay.classes()).toContain('custom-loading')
    expect(overlay.classes()).toContain('is-fullscreen')
    expect(overlay.classes()).toContain('moe-overlay--fixed')
    expect(overlay.attributes('style')).toContain('background-color: rgba(1, 2, 3, 0.4)')
    expect(overlay.attributes('style')).toContain('z-index: 3000')
    expect(wrapper.get('.moe-loading').attributes('role')).toBe('status')
    expect(wrapper.text()).toContain('加载中')
  })

  it('renders VNode and VNode array text and emits destroy after leave', async () => {
    const vnodeWrapper = mount(Loading, {
      props: {
        visible: true,
        text: h('span', { class: 'loading-vnode' }, 'VNode 文案'),
      },
    })
    expect(vnodeWrapper.get('.loading-vnode').text()).toBe('VNode 文案')

    const arrayWrapper = mount(Loading, {
      props: {
        visible: true,
        text: [h('span', { class: 'loading-array' }, '数组文案')],
      },
    })
    expect(arrayWrapper.get('.loading-array').text()).toBe('数组文案')

    arrayWrapper.vm.close()
    emitAfterLeave(arrayWrapper)
    await flushRender()
    expect(arrayWrapper.emitted('destroy')).toHaveLength(1)
  })
})

describe('MoeLoading.service', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetZIndex(3000)
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
    document.body.className = ''
    document.body.style.overflow = ''
  })

  it('creates fullscreen loading by default and closes it', async () => {
    const instance = service({ text: '全屏加载', lock: true })
    await flushRender()

    expect(document.body.querySelector('.moe-loading')?.textContent).toContain('全屏加载')
    expect(document.body.querySelector('.moe-overlay')?.className).toContain('moe-overlay--fixed')
    expect(document.body.classList.contains('is-loading')).toBe(true)
    expect(document.body.style.overflow).toBe('hidden')

    instance.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    expect(document.body.querySelector('.moe-loading')).toBeNull()
    expect(document.body.style.overflow).toBe('')
  })

  it('mounts to HTMLElement target, selector target and fallback body', async () => {
    const target = document.createElement('div')
    document.body.append(target)

    expect(resolveTarget(target)).toBe(target)

    const local = service({
      target,
      text: '局部加载',
      background: 'red',
      customClass: 'local-loading',
    })
    await flushRender()

    expect(target.querySelector('.moe-loading')?.textContent).toContain('局部加载')
    expect(target.style.position).toBe('relative')
    expect(target.querySelector('.moe-overlay')?.className).toContain('moe-overlay--absolute')
    expect(target.querySelector('.moe-overlay')?.className).toContain('local-loading')

    local.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()
    expect(target.style.position).toBe('')

    const selectorTarget = document.createElement('div')
    selectorTarget.id = 'loading-target'
    document.body.append(selectorTarget)
    expect(resolveTarget('#loading-target')).toBe(selectorTarget)
    const selector = service({ target: '#loading-target', text: '选择器加载' })
    await flushRender()
    expect(selectorTarget.querySelector('.moe-loading')?.textContent).toContain('选择器加载')
    selector.close()
    await vi.advanceTimersByTimeAsync(200)

    expect(resolveTarget('#missing-target')).toBe(document.body)
    const fallback = service({ target: '#missing-target', text: '兜底加载' })
    await flushRender()
    expect(document.body.querySelector('.moe-loading')?.textContent).toContain('兜底加载')
    fallback.close()
  })

  it('preserves non-static target position and body target mode', async () => {
    const target = document.createElement('div')
    target.style.position = 'absolute'
    document.body.append(target)

    const local = service({ target, text: '绝对定位加载' })
    await flushRender()
    expect(target.style.position).toBe('absolute')

    local.close()
    await vi.advanceTimersByTimeAsync(200)
    expect(target.style.position).toBe('absolute')

    const bodyLoading = service({ body: true, fullscreen: false, text: 'body 加载' })
    await flushRender()
    expect(document.body.querySelector('.moe-loading')?.textContent).toContain('body 加载')
    bodyLoading.close()
    await vi.advanceTimersByTimeAsync(200)
  })

  it('handles repeated close by clearing pending destroy timer', async () => {
    const instance = service({ text: '重复关闭' })
    await flushRender()

    instance.close()
    instance.close()
    await vi.advanceTimersByTimeAsync(200)
    await flushRender()

    expect(document.body.querySelector('.moe-loading')).toBeNull()
  })

  it('reuses fullscreen instance and respects custom spinner and zIndex', async () => {
    const first = service({ fullscreen: true, spinner: 'mingcute:refresh-line', zIndex: 5000 })
    const second = service({ fullscreen: true })
    await flushRender()

    expect(first).toBe(second)
    expect(document.body.querySelectorAll('.moe-loading')).toHaveLength(1)
    expect(document.body.querySelector<HTMLElement>('.moe-overlay')?.style.zIndex).toBe('5000')

    first.close()
    await vi.advanceTimersByTimeAsync(200)
  })

  it('returns noop instance and resolveTarget fallback without document', () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'document')
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    })

    try {
      expect(resolveTarget()).toBeUndefined()
      expect(() => service().close()).not.toThrow()
    } finally {
      if (descriptor) Object.defineProperty(globalThis, 'document', descriptor)
    }
  })
})

describe('v-loading directive', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
    document.body.className = ''
    document.body.style.overflow = ''
  })

  it('creates, updates and removes local loading from directive value', async () => {
    const enabled = ref(true)
    const count = ref(0)
    const wrapper = mount(
      {
        setup: () => ({ enabled, count }),
        template: `<div class="box" v-loading="enabled" moe-loading-text="加载中">内容 {{ count }}</div>`,
      },
      {
        global: {
          directives: {
            loading: loadingDirective,
          },
        },
        attachTo: document.body,
      }
    )

    await flushRender()
    expect(wrapper.get('.box').element.querySelector('.moe-loading')?.textContent).toContain(
      '加载中'
    )

    count.value++
    await flushRender()
    expect(wrapper.get('.box').element.querySelectorAll('.moe-loading')).toHaveLength(1)

    enabled.value = false
    await flushRender()
    await vi.advanceTimersByTimeAsync(200)
    expect(wrapper.get('.box').element.querySelector('.moe-loading')).toBeNull()

    wrapper.unmount()
  })

  it('creates loading when directive value changes from false to true', async () => {
    const enabled = ref(false)
    const wrapper = mount(
      {
        setup: () => ({ enabled }),
        template: `<div class="box" v-loading="enabled" moe-loading-text="后续创建">内容</div>`,
      },
      {
        global: {
          directives: {
            loading: loadingDirective,
          },
        },
        attachTo: document.body,
      }
    )

    await flushRender()
    expect(wrapper.get('.box').element.querySelector('.moe-loading')).toBeNull()

    enabled.value = true
    await flushRender()
    expect(wrapper.get('.box').element.querySelector('.moe-loading')?.textContent).toContain(
      '后续创建'
    )

    wrapper.unmount()
    await vi.advanceTimersByTimeAsync(200)
  })

  it('closes active loading when directive is unmounted', async () => {
    const wrapper = mount(
      {
        template: `<div class="box" v-loading="true" moe-loading-text="卸载关闭">内容</div>`,
      },
      {
        global: {
          directives: {
            loading: loadingDirective,
          },
        },
        attachTo: document.body,
      }
    )

    await flushRender()
    expect(wrapper.get('.box').element.querySelector('.moe-loading')?.textContent).toContain(
      '卸载关闭'
    )

    wrapper.unmount()
    await vi.advanceTimersByTimeAsync(200)
    expect(document.body.querySelector('.moe-loading')).toBeNull()
  })

  it('reads directive attributes and supports fullscreen lock modifiers', async () => {
    const enabled = ref(true)
    const wrapper = mount(
      {
        setup: () => ({ enabled }),
        template: `
          <div
            v-loading.fullscreen.lock="enabled"
            moe-loading-text="全屏加载"
            moe-loading-spinner="mingcute:refresh-line"
            moe-loading-background="rgba(0, 0, 0, 0.2)"
            moe-loading-custom-class="directive-loading"
          >内容</div>
        `,
      },
      {
        global: {
          directives: {
            loading: loadingDirective,
          },
        },
        attachTo: document.body,
      }
    )

    await flushRender()
    const overlay = document.body.querySelector<HTMLElement>('.moe-overlay')
    expect(overlay?.className).toContain('directive-loading')
    expect(overlay?.getAttribute('style')).toContain('background-color: rgba(0, 0, 0, 0.2)')
    expect(document.body.querySelector('.moe-loading')?.textContent).toContain('全屏加载')
    expect(document.body.style.overflow).toBe('hidden')

    enabled.value = false
    await flushRender()
    await vi.advanceTimersByTimeAsync(200)
    expect(document.body.style.overflow).toBe('')

    wrapper.unmount()
  })

  it('installs directive and global service', () => {
    const app = createApp({ render: () => null })
    app.use(MoeLoading)

    expect(app.config.globalProperties.$loading).toBe(service)
    expect(MoeLoading.directive).toBe(loadingDirective)
  })
})
