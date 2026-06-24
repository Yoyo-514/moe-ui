import { defineComponent, nextTick } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { en } from '@moe-ui/locale'

import ConfigProvider from '../../ConfigProvider/src/ConfigProvider.vue'
import { SELECT_CTX_KEY } from '../src/constants'
import Option from '../src/Option.vue'
import Select from '../src/Select.vue'
import { useKeyMap } from '../src/useKeyMap'

const options = [
  { value: 'Option1', label: 'Option1' },
  { value: 'Option2', label: 'Option2', disabled: true },
  { value: 'Option3', label: 'Option3' },
]

const openSelect = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.get('.moe-select__input').trigger('mousedown')
  await nextTick()
  await nextTick()
}

describe('MoeSelect', () => {
  it('renders placeholder, selected label and accessible roles', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: undefined,
        options,
        placeholder: 'Select',
      },
    })

    const combobox = wrapper.get('.moe-select__input')
    const input = wrapper.get('input')
    expect(combobox.attributes('role')).toBe('combobox')
    expect(input.attributes('placeholder')).toBe('Select')
    expect(combobox.attributes('aria-expanded')).toBe('false')

    await wrapper.setProps({ modelValue: 'Option1' })
    expect((input.element as HTMLInputElement).value).toBe('Option1')

    await openSelect(wrapper)
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3)
  })

  it('uses locale text from config provider', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <ConfigProvider locale={en}>
              <Select modelValue="" options={[]} />
            </ConfigProvider>
          )
        },
      })
    )

    expect(wrapper.get('input').attributes('placeholder')).toBe('Select')

    await openSelect(wrapper)
    expect(wrapper.get('.moe-select__empty').text()).toBe('No data')
  })

  it('selects option and emits update, change and visible-change', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options,
      },
    })

    await openSelect(wrapper)
    await wrapper.findAll('.moe-select__option')[2].trigger('mousedown')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Option3'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['Option3'])
    expect(wrapper.emitted('visible-change')).toEqual([[true], [false]])
  })

  it('does not select disabled option and does not open when disabled', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options,
      },
    })

    await openSelect(wrapper)
    await wrapper.findAll('.moe-select__option')[1].trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    const disabledWrapper = mount(Select, {
      props: {
        disabled: true,
        options,
      },
    })
    await openSelect(disabledWrapper)
    expect(disabledWrapper.emitted('visible-change')).toBeUndefined()
  })

  it('clears selected value with valueOnClear and emits clear', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'Option1',
        options,
        clearable: true,
        valueOnClear: null,
      },
    })

    await wrapper.get('.moe-select__clear').trigger('mousedown')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('change')?.[0]).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('filters options and renders no match text', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options,
        filterable: true,
        noMatchText: '没有匹配项',
      },
    })

    await openSelect(wrapper)
    await wrapper.get('input').setValue('Option3')
    expect(wrapper.findAll('.moe-select__option')).toHaveLength(1)
    expect(wrapper.get('.moe-select__option').text()).toBe('Option3')

    await wrapper.get('input').setValue('missing')
    expect(wrapper.get('.moe-select__empty').text()).toBe('没有匹配项')
  })

  it('uses custom filterMethod, loadingText and noDataText', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options,
        filterable: true,
        filterMethod: (query, option) => String(option.value).endsWith(query),
      },
    })

    await openSelect(wrapper)
    await wrapper.get('input').setValue('1')
    expect(wrapper.findAll('.moe-select__option')).toHaveLength(1)
    expect(wrapper.get('.moe-select__option').text()).toBe('Option1')

    const loadingWrapper = mount(Select, {
      props: {
        loading: true,
        loadingText: '加载中...',
      },
    })
    await openSelect(loadingWrapper)
    expect(loadingWrapper.get('.moe-select__empty').text()).toBe('加载中...')

    const emptyWrapper = mount(Select, {
      props: {
        options: [],
        noDataText: '暂无选项',
      },
    })
    await openSelect(emptyWrapper)
    expect(emptyWrapper.get('.moe-select__empty').text()).toBe('暂无选项')
  })

  it('supports custom option props and object valueKey comparison', async () => {
    const objectValue = { id: 1, name: 'Vue' }
    const wrapper = mount(Select, {
      props: {
        modelValue: { id: 1, name: 'Vue Copy' },
        valueKey: 'id',
        props: {
          value: 'idValue',
          label: 'nameLabel',
          disabled: 'locked',
        },
        options: [
          { idValue: objectValue, nameLabel: 'Vue', locked: false },
          { idValue: { id: 2, name: 'React' }, nameLabel: 'React', locked: true },
        ],
      },
    })

    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('Vue')
    await openSelect(wrapper)
    expect(wrapper.findAll('.moe-select__option')[1].classes()).toContain('is-disabled')
  })

  it('registers, updates and unregisters MoeOption children', async () => {
    const wrapper = mount({
      components: { MoeSelect: Select, MoeOption: Option },
      data: () => ({ value: '', label: 'Slot Option', show: true }),
      template: `
        <moe-select v-model="value">
          <moe-option v-if="show" :label="label" value="slot" />
        </moe-select>
      `,
    })

    await nextTick()
    await wrapper.get('.moe-select__input').trigger('mousedown')
    expect(wrapper.get('.moe-select__option').text()).toBe('Slot Option')

    await wrapper.setData({ label: 'Updated Option' })
    expect(wrapper.get('.moe-select__option').text()).toBe('Updated Option')

    await wrapper.setData({ show: false })
    await nextTick()
    expect(wrapper.find('.moe-select__option').exists()).toBe(false)
  })

  it('lets MoeOption safely render without select context', async () => {
    const wrapper = mount(Option, {
      props: {
        value: 'standalone',
      },
      slots: {
        default: () => '独立选项',
      },
    })

    expect(wrapper.text()).toBe('独立选项')
    await wrapper.setProps({ label: '更新', disabled: true })
    wrapper.unmount()
  })

  it('registers object option payload through injected context', async () => {
    const registerOption = vi.fn()
    const unregisterOption = vi.fn()
    const wrapper = mount(Option, {
      global: {
        provide: {
          [SELECT_CTX_KEY as symbol]: {
            registerOption,
            unregisterOption,
          },
        },
      },
      props: {
        value: 'slot',
      },
    })

    expect(registerOption).toHaveBeenLastCalledWith({
      value: 'slot',
      label: '',
      disabled: false,
      raw: {
        value: 'slot',
        label: '',
        disabled: false,
      },
    })

    await wrapper.setProps({ label: 'Slot Option', disabled: true })
    expect(registerOption).toHaveBeenLastCalledWith({
      value: 'slot',
      label: 'Slot Option',
      disabled: true,
      raw: {
        value: 'slot',
        label: 'Slot Option',
        disabled: true,
      },
    })

    wrapper.unmount()
    expect(unregisterOption).toHaveBeenCalledWith('slot')
  })

  it('maps keyboard events to actions and ignores unsupported keys', () => {
    const actions = {
      next: vi.fn(),
      prev: vi.fn(),
      select: vi.fn(),
      close: vi.fn(),
    }
    const onKeydown = useKeyMap(actions)
    const unsupported = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })
    const arrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true })

    onKeydown(unsupported)
    expect(unsupported.defaultPrevented).toBe(false)
    expect(actions.next).not.toHaveBeenCalled()

    onKeydown(arrowDown)
    expect(arrowDown.defaultPrevented).toBe(true)
    expect(actions.next).toHaveBeenCalledOnce()
  })

  it('supports keyboard interaction and skips disabled options', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options,
      },
    })

    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Option3'])
  })

  it('opens from ArrowUp, wraps hover and closes by Escape', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options,
      },
    })

    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    await nextTick()
    expect(wrapper.get('.moe-select__input').attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('.moe-select__option')[0].classes()).toContain('is-hovering')

    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.findAll('.moe-select__option')[2].classes()).toContain('is-hovering')

    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.get('.moe-select__input').attributes('aria-expanded')).toBe('false')
  })

  it('opens from input typing, selected Enter and tooltip visibility updates', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options,
        filterable: true,
      },
    })

    await wrapper.get('input').setValue('Option3')
    expect(wrapper.get('.moe-select__input').attributes('aria-expanded')).toBe('true')
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Option3'])

    wrapper.findComponent({ name: 'MoeTooltip' }).vm.$emit('update:visible', true)
    await nextTick()
    expect(wrapper.get('.moe-select__input').attributes('aria-expanded')).toBe('true')

    wrapper.findComponent({ name: 'MoeTooltip' }).vm.$emit('update:visible', false)
    await nextTick()
    expect(wrapper.get('.moe-select__input').attributes('aria-expanded')).toBe('false')
  })

  it('keeps disabled select closed for keyboard and mouse interactions', async () => {
    const wrapper = mount(Select, {
      props: {
        disabled: true,
        options,
      },
    })

    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('.moe-select__input').trigger('mousedown')

    expect(wrapper.emitted('visible-change')).toBeUndefined()
    expect(wrapper.get('.moe-select__input').attributes('aria-expanded')).toBe('false')
  })

  it('toggles closed on second trigger mousedown and selects hovered option by Enter', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options,
      },
    })

    await wrapper.get('.moe-select__input').trigger('mousedown')
    await nextTick()
    await wrapper.get('.moe-select__input').trigger('mousedown')
    expect(wrapper.get('.moe-select__input').attributes('aria-expanded')).toBe('false')

    await wrapper.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.get('.moe-select__input').attributes('aria-expanded')).toBe('true')

    await wrapper.findAll('.moe-select__option')[2].trigger('mouseenter')
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Option3'])
  })

  it('keeps hover movement safe when no options are available', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: [],
      },
    })

    await openSelect(wrapper)
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('does not select while loading and preserves clear hidden branch', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'Option1',
        options,
        loading: true,
        clearable: true,
      },
    })

    await openSelect(wrapper)
    expect(wrapper.find('.moe-select__clear').exists()).toBe(false)
    await wrapper.setProps({ loading: false })
    await nextTick()
    await nextTick()
    await wrapper.findAll('.moe-select__option')[2].trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Option3'])
  })

  it('supports focus, blur and selectedLabel exposes', async () => {
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: {
        modelValue: 'Option1',
        options,
      },
    })

    expect(wrapper.vm.selectedLabel).toBe('Option1')
    await wrapper.vm.focus()
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('input').element)

    await openSelect(wrapper)
    wrapper.vm.blur()
    await nextTick()
    expect(wrapper.emitted('blur')).toBeTruthy()
    expect(wrapper.get('.moe-select__input').attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})
