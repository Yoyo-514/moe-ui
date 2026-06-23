import { h, markRaw } from 'vue'

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { flushRender } from '@moe-ui/test-utils'

import { MoeInput } from '../index'
import Input from '../src/Input.vue'

const setValue = async (wrapper: ReturnType<typeof mount<typeof Input>>, value: string) => {
  const control = wrapper.find('input').exists() ? wrapper.get('input') : wrapper.get('textarea')
  await control.setValue(value)
}

describe('Input.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  describe('public API and native attributes', () => {
    it('registers through install and renders native input attributes', () => {
      const wrapper = mount(
        {
          template: `
            <moe-input
              id="username"
              v-model="value"
              name="username"
              form="login-form"
              placeholder="请输入用户名"
              autocomplete="username"
              maxlength="12"
              minlength="2"
              tabindex="1"
            />
          `,
          data: () => ({ value: 'moe' }),
        },
        {
          global: {
            plugins: [MoeInput],
          },
        }
      )

      const input = wrapper.get('input')
      expect(input.element.value).toBe('moe')
      expect(input.attributes('id')).toBe('username')
      expect(input.attributes('name')).toBe('username')
      expect(input.attributes('form')).toBe('login-form')
      expect(input.attributes('placeholder')).toBe('请输入用户名')
      expect(input.attributes('autocomplete')).toBe('username')
      expect(input.attributes('maxlength')).toBe('12')
      expect(input.attributes('minlength')).toBe('2')
      expect(input.attributes('tabindex')).toBe('1')
    })

    it('normalizes number and empty model values for display', async () => {
      const wrapper = mount(Input, {
        props: {
          modelValue: 123,
        },
      })

      expect(wrapper.get('input').element.value).toBe('123')

      await wrapper.setProps({ modelValue: undefined })
      expect(wrapper.get('input').element.value).toBe('')

      await wrapper.setProps({ modelValue: null })
      expect(wrapper.get('input').element.value).toBe('')
    })

    it('emits update, input, change, focus and blur from user interaction', async () => {
      const wrapper = mount(Input, {
        props: {
          modelValue: '',
        },
      })
      const input = wrapper.get('input')

      await input.setValue('hello')
      await input.trigger('change')
      await input.trigger('focus')
      await input.trigger('blur')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
      expect(wrapper.emitted('input')?.[0]).toEqual(['hello'])
      expect(wrapper.emitted('change')?.[0]).toEqual(['hello'])
      expect(wrapper.emitted('focus')).toHaveLength(1)
      expect(wrapper.emitted('blur')).toHaveLength(1)
    })

    it('exposes focus, blur, select and clear', async () => {
      const wrapper = mount(Input, {
        attachTo: document.body,
        props: {
          modelValue: 'content',
          clearable: true,
        },
      })
      const input = wrapper.get('input').element
      input.focus = vi.fn()
      input.blur = vi.fn()
      input.select = vi.fn()

      await wrapper.vm.focus()
      wrapper.vm.select()
      wrapper.vm.blur()
      wrapper.vm.clear()
      await flushRender()

      expect(input.focus).toHaveBeenCalled()
      expect(input.select).toHaveBeenCalledOnce()
      expect(input.blur).toHaveBeenCalledOnce()
      expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([''])
      expect(wrapper.emitted('clear')).toHaveLength(1)
    })
  })

  describe('states and controls', () => {
    it('renders disabled and readonly states with aria attributes', () => {
      const disabled = mount(Input, {
        props: {
          disabled: true,
          modelValue: 'disabled',
        },
      })
      const readonly = mount(Input, {
        props: {
          readonly: true,
          modelValue: 'readonly',
        },
      })

      expect(disabled.classes()).toContain('is-disabled')
      expect(disabled.get('input').attributes('disabled')).toBeDefined()
      expect(disabled.get('input').attributes('aria-disabled')).toBe('true')
      expect(readonly.classes()).toContain('is-readonly')
      expect(readonly.get('input').attributes('readonly')).toBeDefined()
      expect(readonly.get('input').attributes('aria-readonly')).toBe('true')
    })

    it('clears input when clearable control is visible and keeps disabled/readonly immutable', async () => {
      const wrapper = mount(Input, {
        props: {
          modelValue: '可以清空',
          clearable: true,
        },
      })

      const clearButton = wrapper.get('.moe-input__clear')
      expect(clearButton.attributes('style')).toContain('visibility: hidden')

      await wrapper.trigger('mouseenter')
      expect(wrapper.get('.moe-input__clear').attributes('style')).toContain('visibility: visible')

      await wrapper.trigger('mouseleave')
      expect(wrapper.get('.moe-input__clear').attributes('style')).toContain('visibility: hidden')

      await wrapper.get('input').trigger('focus')
      expect(wrapper.classes()).toContain('has-suffix')
      expect(
        wrapper.find('.moe-input__wrapper > .moe-input__suffix .moe-input__clear').exists()
      ).toBe(true)
      expect(wrapper.get('.moe-input__clear').attributes('style')).toContain('visibility: visible')

      await wrapper.get('.moe-input__clear').trigger('click')
      await flushRender()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
      expect(wrapper.emitted('input')?.[0]).toEqual([''])
      expect(wrapper.emitted('clear')).toHaveLength(1)

      const readonly = mount(Input, {
        props: {
          modelValue: '不能清空',
          clearable: true,
          readonly: true,
        },
      })
      readonly.vm.clear()
      expect(readonly.emitted('clear')).toBeUndefined()
    })

    it('toggles password visibility and restores focus but respects readonly', async () => {
      const wrapper = mount(Input, {
        props: {
          modelValue: 'secret',
          type: 'password',
          showPassword: true,
        },
      })
      const input = wrapper.get('input').element
      input.focus = vi.fn()

      expect(wrapper.get('input').attributes('type')).toBe('password')
      await wrapper.get('.moe-input__password').trigger('click')
      await flushRender()

      expect(wrapper.get('input').attributes('type')).toBe('text')
      expect(input.focus).toHaveBeenCalled()

      const readonly = mount(Input, {
        props: {
          modelValue: 'secret',
          type: 'password',
          showPassword: true,
          readonly: true,
        },
      })
      await readonly.get('.moe-input__password').trigger('click')
      await flushRender()
      expect(readonly.get('input').attributes('type')).toBe('password')
    })

    it('renders word limit and size class only when maxlength is valid', async () => {
      const wrapper = mount(Input, {
        props: {
          modelValue: 'moe',
          maxlength: 10,
          showWordLimit: true,
          size: 'large',
        },
      })

      expect(wrapper.classes()).toContain('moe-input--large')
      expect(wrapper.get('.moe-input__word-limit').text()).toBe('3 / 10')

      await wrapper.setProps({ maxlength: '' })
      expect(wrapper.find('.moe-input__word-limit').exists()).toBe(false)

      await wrapper.setProps({ maxlength: 'invalid' })
      expect(wrapper.find('.moe-input__word-limit').exists()).toBe(false)
    })
  })

  describe('icons and slots', () => {
    it('renders prefix and suffix icons', () => {
      const wrapper = mount(Input, {
        props: {
          prefixIcon: 'mingcute:user-line',
          suffixIcon: 'mingcute:search-line',
        },
      })

      expect(wrapper.find('.moe-input__prefix').exists()).toBe(true)
      expect(wrapper.find('.moe-input__suffix').exists()).toBe(true)
    })

    it('prefers prefix and suffix slots over icon props and renders prepend append slots', () => {
      const wrapper = mount(Input, {
        props: {
          prefixIcon: 'mingcute:user-line',
          suffixIcon: 'mingcute:search-line',
        },
        slots: {
          prefix: () => <span class="prefix-slot">前</span>,
          suffix: () => <span class="suffix-slot">后</span>,
          prepend: () => <span class="prepend-slot">https://</span>,
          append: () => <span class="append-slot">.com</span>,
        },
      })

      expect(wrapper.get('.prefix-slot').text()).toBe('前')
      expect(wrapper.get('.suffix-slot').text()).toBe('后')
      expect(wrapper.get('.prepend-slot').text()).toBe('https://')
      expect(wrapper.get('.append-slot').text()).toBe('.com')
      expect(wrapper.classes()).toContain('has-prepend')
      expect(wrapper.classes()).toContain('has-append')
    })

    it('supports component icons', () => {
      const CustomIcon = markRaw({ render: () => h('span', { class: 'custom-icon' }, '图') })
      const wrapper = mount(Input, {
        props: {
          prefixIcon: CustomIcon,
          suffixIcon: CustomIcon,
        },
      })

      expect(wrapper.findAll('.custom-icon')).toHaveLength(2)
    })
  })

  describe('textarea', () => {
    it('renders textarea with native attributes and no input addons', () => {
      const wrapper = mount(Input, {
        props: {
          type: 'textarea',
          modelValue: '多行内容',
          rows: 4,
          resize: 'none',
          form: 'profile-form',
          id: 'bio',
          name: 'bio',
          placeholder: '请输入简介',
          maxlength: 30,
          minlength: 2,
          prefixIcon: 'mingcute:user-line',
        },
        slots: {
          prepend: () => 'prepend',
          append: () => 'append',
        },
      })
      const textarea = wrapper.get('textarea')

      expect(wrapper.classes()).toContain('is-textarea')
      expect(textarea.element.value).toBe('多行内容')
      expect(textarea.attributes('rows')).toBe('4')
      expect(textarea.attributes('form')).toBe('profile-form')
      expect(textarea.attributes('id')).toBe('bio')
      expect(textarea.attributes('name')).toBe('bio')
      expect(textarea.attributes('placeholder')).toBe('请输入简介')
      expect(textarea.attributes('maxlength')).toBe('30')
      expect(textarea.attributes('minlength')).toBe('2')
      expect(textarea.attributes('style')).toContain('resize: none')
      expect(wrapper.find('.moe-input__prefix').exists()).toBe(false)
      expect(wrapper.find('.moe-input__prepend').exists()).toBe(false)
      expect(wrapper.find('.moe-input__append').exists()).toBe(false)
    })

    it('emits textarea events and supports clearable UI', async () => {
      const wrapper = mount(Input, {
        props: {
          type: 'textarea',
          modelValue: 'textarea',
          clearable: true,
        },
      })

      await setValue(wrapper, '新的内容')
      await wrapper.get('textarea').trigger('change')
      await wrapper.get('textarea').trigger('focus')
      expect(wrapper.find('.moe-input__textarea-clear').exists()).toBe(true)

      await wrapper.get('.moe-input__textarea-clear').trigger('click')
      await flushRender()

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['新的内容'])
      expect(wrapper.emitted('input')?.[0]).toEqual(['新的内容'])
      expect(wrapper.emitted('change')?.[0]).toEqual(['新的内容'])
      expect(wrapper.emitted('clear')).toHaveLength(1)
    })

    it('renders textarea word limit', () => {
      const wrapper = mount(Input, {
        props: {
          type: 'textarea',
          modelValue: 'abc',
          maxlength: '20',
          showWordLimit: true,
        },
      })

      expect(wrapper.get('.moe-input__textarea-word-limit').text()).toBe('3 / 20')
    })

    it('autosizes textarea by scrollHeight and min/max rows', async () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        lineHeight: '20px',
        paddingTop: '4px',
        paddingBottom: '4px',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
      } as CSSStyleDeclaration)
      const wrapper = mount(Input, {
        props: {
          type: 'textarea',
          modelValue: 'autosize',
          autosize: { minRows: 2, maxRows: 4 },
        },
      })
      const textarea = wrapper.get('textarea').element
      Object.defineProperty(textarea, 'scrollHeight', {
        configurable: true,
        value: 120,
      })

      await wrapper.setProps({ modelValue: 'autosize changed' })
      await flushRender()

      expect(textarea.style.height).toBe('90px')
      expect(textarea.style.overflowY).toBe('auto')
    })

    it('uses fallback line-height when autosize row style is non-numeric', async () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        lineHeight: 'normal',
        paddingTop: 'bad',
        paddingBottom: 'bad',
        borderTopWidth: 'bad',
        borderBottomWidth: 'bad',
      } as CSSStyleDeclaration)
      const wrapper = mount(Input, {
        props: {
          type: 'textarea',
          modelValue: 'fallback',
          autosize: { minRows: 3 },
        },
      })
      const textarea = wrapper.get('textarea').element
      Object.defineProperty(textarea, 'scrollHeight', {
        configurable: true,
        value: 24,
      })

      await wrapper.setProps({ modelValue: 'fallback changed' })
      await flushRender()

      expect(textarea.style.height).toBe('60px')
    })

    it('autosizes textarea without max rows after model update and user input', async () => {
      const wrapper = mount(Input, {
        props: {
          type: 'textarea',
          modelValue: 'autosize',
          autosize: true,
        },
      })
      const textarea = wrapper.get('textarea').element
      Object.defineProperty(textarea, 'scrollHeight', {
        configurable: true,
        value: 88,
      })

      await wrapper.setProps({ modelValue: 'autosize changed' })
      await flushRender()

      expect(textarea.style.height).toBe('88px')
      expect(textarea.style.overflowY).toBe('hidden')

      Object.defineProperty(textarea, 'scrollHeight', {
        configurable: true,
        value: 112,
      })
      await wrapper.get('textarea').setValue('用户输入触发自适应高度')
      await flushRender()

      expect(textarea.style.height).toBe('112px')
      expect(textarea.style.overflowY).toBe('hidden')
    })
  })
})
