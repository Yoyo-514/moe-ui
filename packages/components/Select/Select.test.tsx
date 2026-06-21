import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import Option from './Option.vue'
import Select from './Select.vue'

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
    expect(wrapper.get('[role="listbox"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3)
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

  it('registers MoeOption children', async () => {
    const wrapper = mount({
      components: { MoeSelect: Select, MoeOption: Option },
      data: () => ({ value: '' }),
      template: `
        <moe-select v-model="value">
          <moe-option label="Slot Option" value="slot" />
        </moe-select>
      `,
    })

    await nextTick()
    await wrapper.get('.moe-select__input').trigger('mousedown')
    expect(wrapper.get('.moe-select__option').text()).toBe('Slot Option')
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
