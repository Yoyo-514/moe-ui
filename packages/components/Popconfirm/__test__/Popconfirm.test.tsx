import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { flushRender, flushTimers, popperMock as popper } from '@moe-ui/test-utils'

import { MoePopconfirm } from '../index'
import Popconfirm from '../src/Popconfirm.vue'

const mountPopconfirm = (options: Parameters<typeof mount<typeof Popconfirm>>[1] = {}) => {
  const { props, slots, ...restOptions } = options

  return mount(Popconfirm, {
    ...restOptions,
    props: {
      title: '确定删除吗？',
      hideAfter: 0,
      ...(props ?? {}),
    },
    slots: {
      reference: () => (
        <button class="reference" type="button">
          删除
        </button>
      ),
      ...(slots ?? {}),
    },
  })
}

describe('Popconfirm.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    popper.reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('public API', () => {
    it('registers through install and opens by clicking reference slot', async () => {
      const wrapper = mount(
        {
          template: `
            <moe-popconfirm title="Installed popconfirm" :hide-after="0">
              <template #reference>
                <button class="reference" type="button">open</button>
              </template>
            </moe-popconfirm>
          `,
        },
        {
          global: {
            plugins: [MoePopconfirm],
          },
        }
      )

      await wrapper.get('.reference').trigger('click')
      await flushTimers()

      expect(wrapper.get('[role="dialog"]').text()).toContain('Installed popconfirm')
      expect(popper.createPopper).toHaveBeenCalled()
    })

    it('emits confirm and cancel from default action buttons', async () => {
      const wrapper = mountPopconfirm({
        props: {
          confirmButtonText: '继续',
          cancelButtonText: '返回',
        },
      })

      await wrapper.get('.reference').trigger('click')
      await flushTimers()

      const buttons = wrapper.findAll('.moe-popconfirm__actions .moe-button')
      expect(buttons).toHaveLength(2)
      expect(buttons[0].text()).toBe('返回')
      expect(buttons[1].text()).toBe('继续')

      await buttons[1].trigger('click')
      await flushTimers()
      expect(wrapper.emitted('confirm')).toHaveLength(1)
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

      await wrapper.get('.reference').trigger('click')
      await flushTimers()
      await wrapper.findAll('.moe-popconfirm__actions .moe-button')[0].trigger('click')
      await flushTimers()
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })
  })

  describe('DOM and semantic output', () => {
    it('renders dialog role, title, custom width, icon color and button types', async () => {
      const wrapper = mountPopconfirm({
        props: {
          title: '确认归档这个项目吗？',
          width: 240,
          icon: 'mingcute:warning-line',
          iconColor: '#f59e0b',
          confirmButtonType: 'danger',
          cancelButtonType: 'info',
        },
      })

      await wrapper.get('.reference').trigger('click')
      await flushTimers()

      const dialog = wrapper.get('[role="dialog"]')
      expect(dialog.classes()).toContain('moe-popconfirm')
      expect(dialog.attributes('aria-modal')).toBe('false')
      expect(dialog.attributes('style')).toContain('width: 240px')
      expect(dialog.text()).toContain('确认归档这个项目吗？')
      expect(wrapper.get('.moe-popconfirm__icon').attributes('style')).toContain(
        'color: rgb(245, 158, 11)'
      )
      expect(wrapper.findAll('.moe-popconfirm__actions .moe-button')[0].classes()).toContain(
        'moe-button--info'
      )
      expect(wrapper.findAll('.moe-popconfirm__actions .moe-button')[1].classes()).toContain(
        'moe-button--danger'
      )
    })

    it('does not render broken width style when width is empty', async () => {
      const wrapper = mountPopconfirm({
        props: {
          width: '',
        },
      })

      await wrapper.get('.reference').trigger('click')
      await flushTimers()

      expect(wrapper.get('[role="dialog"]').attributes('style')).toBeUndefined()
    })

    it('supports empty title, empty icon and string width without broken content', async () => {
      const wrapper = mountPopconfirm({
        props: {
          title: '',
          icon: '',
          width: '18rem',
        },
      })

      await wrapper.get('.reference').trigger('click')
      await flushTimers()

      const dialog = wrapper.get('[role="dialog"]')
      expect(dialog.attributes('style')).toContain('width: 18rem')
      expect(wrapper.find('.moe-popconfirm__title').exists()).toBe(false)
      expect(wrapper.find('.moe-popconfirm__icon').exists()).toBe(false)
    })

    it('does not render icon when hideIcon is true', async () => {
      const wrapper = mountPopconfirm({
        props: {
          hideIcon: true,
        },
      })

      await wrapper.get('.reference').trigger('click')
      await flushTimers()

      expect(wrapper.find('.moe-popconfirm__icon').exists()).toBe(false)
      expect(wrapper.get('[role="dialog"]').text()).toContain('确定删除吗？')
    })
  })

  describe('slots and user interactions', () => {
    it('uses actions slot before default buttons and keeps slot props interactive', async () => {
      const wrapper = mountPopconfirm({
        slots: {
          actions: ({
            confirm,
            cancel,
          }: {
            confirm: (event: MouseEvent) => void
            cancel: (event: MouseEvent) => void
          }) => (
            <>
              <button class="custom-cancel" type="button" onClick={cancel}>
                自定义取消
              </button>
              <button class="custom-confirm" type="button" onClick={confirm}>
                自定义确认
              </button>
            </>
          ),
        },
      })

      await wrapper.get('.reference').trigger('click')
      await flushTimers()

      expect(wrapper.find('.moe-popconfirm__actions .moe-button').exists()).toBe(false)
      expect(wrapper.get('.custom-confirm').text()).toBe('自定义确认')

      await wrapper.get('.custom-confirm').trigger('click')
      await flushTimers()
      expect(wrapper.emitted('confirm')).toHaveLength(1)
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

      await wrapper.get('.reference').trigger('click')
      await flushTimers()
      await wrapper.get('.custom-cancel').trigger('click')
      await flushTimers()
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('delays closing after confirm according to hideAfter', async () => {
      const wrapper = mountPopconfirm({
        props: {
          hideAfter: 100,
        },
      })

      await wrapper.get('.reference').trigger('click')
      await flushTimers()
      await wrapper.findAll('.moe-popconfirm__actions .moe-button')[1].trigger('click')
      await flushRender()

      expect(wrapper.emitted('confirm')).toHaveLength(1)
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

      await vi.advanceTimersByTimeAsync(99)
      await flushRender()
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

      await vi.advanceTimersByTimeAsync(1)
      await flushRender()
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    })

    it('closes when clicking outside because it inherits Tooltip click-outside behavior', async () => {
      const wrapper = mountPopconfirm()

      await wrapper.get('.reference').trigger('click')
      await flushTimers()
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

      document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      await flushTimers()

      expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    })
  })
})
