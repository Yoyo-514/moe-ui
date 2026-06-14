import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import DropdownMenu from './DropdownMenu.vue'
import { MoeDropdown, MoeDropdownItem, MoeDropdownMenu } from './index'

const { createPopperMock, popperDestroy, popperSetOptions, popperUpdate } = vi.hoisted(() => {
  const popperDestroy = vi.fn()
  const popperSetOptions = vi.fn()
  const popperUpdate = vi.fn()
  const createPopperMock = vi.fn(() => ({
    destroy: popperDestroy,
    setOptions: popperSetOptions,
    update: popperUpdate,
  }))

  return {
    createPopperMock,
    popperDestroy,
    popperSetOptions,
    popperUpdate,
  }
})

vi.mock('@popperjs/core', () => ({
  createPopper: createPopperMock,
}))

const flushTimers = async () => {
  await vi.runOnlyPendingTimersAsync()
  await nextTick()
  await nextTick()
}

const mountDropdown = (options: Parameters<typeof mount<typeof Dropdown>>[1] = {}) => {
  const { props, slots, global, ...restOptions } = options
  const mergedSlots = {
    default: () => (
      <button class="reference" type="button">
        打开菜单
      </button>
    ),
    dropdown: () => (
      <DropdownMenu>
        <DropdownItem command="profile">个人中心</DropdownItem>
        <DropdownItem command="logout">退出登录</DropdownItem>
      </DropdownMenu>
    ),
    ...(slots ?? {}),
  }

  Object.keys(mergedSlots).forEach((key) => {
    if (mergedSlots[key as keyof typeof mergedSlots] === undefined) {
      delete mergedSlots[key as keyof typeof mergedSlots]
    }
  })

  return mount(Dropdown, {
    ...restOptions,
    props: {
      trigger: 'click',
      hideAfter: 0,
      ...(props ?? {}),
    },
    slots: mergedSlots,
    global: {
      components: {
        DropdownItem,
        DropdownMenu,
      },
      ...(global ?? {}),
    },
  })
}

describe('Dropdown.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    createPopperMock.mockClear()
    popperDestroy.mockClear()
    popperSetOptions.mockClear()
    popperUpdate.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('public API', () => {
    it('registers through install and opens dropdown slot by clicking default slot', async () => {
      const wrapper = mount(
        {
          template: `
            <moe-dropdown trigger="click" :hide-after="0">
              <button class="reference" type="button">菜单</button>
              <template #dropdown>
                <moe-dropdown-menu>
                  <moe-dropdown-item command="copy">复制</moe-dropdown-item>
                </moe-dropdown-menu>
              </template>
            </moe-dropdown>
          `,
        },
        {
          global: {
            plugins: [MoeDropdown, MoeDropdownMenu, MoeDropdownItem],
          },
        }
      )

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()

      expect(wrapper.get('[role="menu"]').text()).toContain('复制')
      expect(wrapper.get('[role="menuitem"]').text()).toContain('复制')
      expect(wrapper.get('[role="menuitem"]').attributes('id')).toMatch(/^moe-dropdown-item-/)
      expect(createPopperMock).toHaveBeenCalled()
    })

    it('supports update:visible and exposed open/close methods', async () => {
      const wrapper = mountDropdown()

      wrapper.vm.open()
      await flushTimers()
      expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
      expect(wrapper.find('[role="menu"]').exists()).toBe(true)

      wrapper.vm.close()
      await flushTimers()
      expect(wrapper.emitted('update:visible')?.slice(-1)[0]).toEqual([false])
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })
  })

  describe('menu and item behavior', () => {
    it('emits command and closes menu when item is clicked', async () => {
      const wrapper = mountDropdown()

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()
      await wrapper.findAll('[role="menuitem"]')[0].trigger('click')
      await flushTimers()

      expect(wrapper.emitted('command')?.[0]).toEqual(['profile'])
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('closes menu when clicking outside because it inherits Tooltip click-outside behavior', async () => {
      const wrapper = mountDropdown()

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()
      expect(wrapper.find('[role="menu"]').exists()).toBe(true)

      document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      await flushTimers()

      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
      expect(wrapper.emitted('update:visible')?.slice(-1)[0]).toEqual([false])
    })

    it('keeps menu open when hideOnClick is false', async () => {
      const wrapper = mountDropdown({
        props: {
          hideOnClick: false,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()
      await wrapper.findAll('[role="menuitem"]')[0].trigger('click')
      await flushTimers()

      expect(wrapper.emitted('command')?.[0]).toEqual(['profile'])
      expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    })

    it('renders items prop and ignores disabled item click', async () => {
      const wrapper = mountDropdown({
        props: {
          items: [
            { command: 'enabled', icon: 'mingcute:user-line' },
            { command: 'disabled', disabled: true, divided: true },
          ],
        },
        slots: {
          dropdown: undefined,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()

      const items = wrapper.findAll('[role="menuitem"]')
      expect(items).toHaveLength(2)
      expect(items[0].attributes('id')).toMatch(/^moe-dropdown-item-/)
      expect(items[1].attributes('id')).toMatch(/^moe-dropdown-item-/)
      expect(items[0].text()).toContain('enabled')
      expect(items[0].find('.moe-dropdown-item__icon').exists()).toBe(true)
      expect(items[1].classes()).toContain('is-disabled')
      expect(items[1].classes()).toContain('is-divided')
      expect(items[1].attributes('aria-disabled')).toBe('true')

      await items[1].trigger('click')
      expect(wrapper.emitted('command')).toBeUndefined()
    })

    it('prefers item icon slot over icon prop', async () => {
      const wrapper = mountDropdown({
        slots: {
          dropdown: () => (
            <DropdownMenu>
              <DropdownItem command="setting" icon="mingcute:settings-line">
                {{
                  icon: () => <span class="custom-icon">图</span>,
                  default: () => '设置',
                }}
              </DropdownItem>
            </DropdownMenu>
          ),
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()

      expect(wrapper.get('.custom-icon').text()).toBe('图')
      expect(wrapper.get('[role="menuitem"]').text()).toContain('设置')
    })

    it('emits object command from items prop without rendering object as label', async () => {
      const command = { action: 'archive', id: 1 }
      const wrapper = mountDropdown({
        props: {
          items: [{ command }],
        },
        slots: {
          dropdown: undefined,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()

      const item = wrapper.get('[role="menuitem"]')
      expect(item.text()).toBe('')
      expect(item.text()).not.toContain('[object Object]')

      await item.trigger('click')
      await flushTimers()

      expect(wrapper.emitted('command')?.[0]).toEqual([command])
    })

    it('emits object command as payload and uses default slot as label', async () => {
      const command = { action: 'archive', id: 1 }
      const wrapper = mountDropdown({
        slots: {
          dropdown: () => (
            <DropdownMenu>
              <DropdownItem command={command}>归档项目</DropdownItem>
            </DropdownMenu>
          ),
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()

      const item = wrapper.get('[role="menuitem"]')
      expect(item.text()).toBe('归档项目')
      expect(item.text()).not.toContain('[object Object]')

      await item.trigger('click')
      await flushTimers()

      expect(wrapper.emitted('command')?.[0]).toEqual([command])
    })
  })

  describe('split button', () => {
    it('emits click from main button without opening menu', async () => {
      const wrapper = mountDropdown({
        props: {
          splitButton: true,
        },
        slots: {
          default: () => '操作',
        },
      })

      await wrapper.get('.moe-dropdown__split-button > .moe-button').trigger('click')
      await flushTimers()

      expect(wrapper.emitted('click')).toHaveLength(1)
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('passes offset to tooltip popper modifier', async () => {
      const wrapper = mountDropdown({
        props: {
          offset: 24,
        },
      })

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()

      expect(createPopperMock.mock.calls[0][2].modifiers).toContainEqual({
        name: 'offset',
        options: {
          offset: [0, 24],
        },
      })
    })

    it('renders items prop in split button dropdown menu', async () => {
      const wrapper = mountDropdown({
        props: {
          splitButton: true,
          items: [
            { command: 'copy', icon: 'mingcute:copy-line' },
            { command: 'delete', disabled: true, divided: true },
          ],
        },
        slots: {
          default: () => '操作',
          dropdown: undefined,
        },
      })

      await wrapper.get('.moe-dropdown__split-button .moe-tooltip__trigger').trigger('click')
      await flushTimers()

      const items = wrapper.findAll('[role="menuitem"]')
      expect(items).toHaveLength(2)
      expect(items[0].text()).toContain('copy')
      expect(items[0].find('.moe-dropdown-item__icon').exists()).toBe(true)
      expect(items[1].classes()).toContain('is-disabled')
      expect(items[1].classes()).toContain('is-divided')
    })

    it('uses caret button as popper reference in split button mode', async () => {
      const wrapper = mountDropdown({
        props: {
          splitButton: true,
        },
        slots: {
          default: () => '操作',
        },
      })

      await wrapper.get('.moe-dropdown__split-button .moe-tooltip__trigger').trigger('click')
      await flushTimers()

      //@ts-expect-error just test
      const reference = createPopperMock.mock.calls[0][0] as HTMLElement
      expect(reference.classList.contains('moe-tooltip__trigger')).toBe(true)
      expect(reference.closest('.moe-dropdown__split-button')).not.toBeNull()
      expect(reference.querySelector('.moe-dropdown__caret-button')).not.toBeNull()
      expect(reference.textContent).not.toContain('操作')
    })
  })

  describe('controlled visibility boundary', () => {
    it('does not render menu from internal click when visible is controlled as false', async () => {
      const Demo = defineComponent({
        setup() {
          const visible = ref(false)
          return { visible }
        },
        render() {
          return (
            <Dropdown v-model:visible={this.visible} trigger="click" hideAfter={0}>
              {{
                default: () => (
                  <button class="reference" type="button">
                    打开菜单
                  </button>
                ),
                dropdown: () => (
                  <DropdownMenu>
                    <DropdownItem command="copy">复制</DropdownItem>
                  </DropdownMenu>
                ),
              }}
            </Dropdown>
          )
        },
      })
      const wrapper = mount(Demo)

      await wrapper.get('.moe-tooltip__trigger').trigger('click')
      await flushTimers()

      expect(wrapper.vm.visible).toBe(true)
      expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    })
  })
})
