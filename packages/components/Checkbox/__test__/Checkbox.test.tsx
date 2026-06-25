import { defineComponent, nextTick, reactive, ref } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Form from '../../Form/src/Form.vue'
import FormItem from '../../Form/src/FormItem.vue'
import { MoeCheckbox, MoeCheckboxGroup } from '../index'
import Checkbox from '../src/Checkbox.vue'
import CheckboxGroup from '../src/CheckboxGroup.vue'

import type { FormInstance } from '../../Form/src/types'

describe('MoeCheckbox', () => {
  it('renders label and toggles boolean model', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false, label: 'Agree' } })
    const input = wrapper.get('input')

    expect(wrapper.text()).toContain('Agree')
    expect(input.element.checked).toBe(false)

    await input.setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('supports array model without group', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: ['a'], value: 'b', label: 'B' },
    })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])

    await wrapper.setProps({ modelValue: ['a', 'b'] })
    await wrapper.get('input').setValue(false)

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['a']])
  })

  it('exposes focus method', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    const focus = vi.spyOn(wrapper.get('input').element, 'focus')

    wrapper.vm.focus()

    expect(focus).toHaveBeenCalled()
  })

  it('supports native input attributes', () => {
    const wrapper = mount(Checkbox, {
      props: {
        checked: true,
        tabindex: 1,
        ariaControls: 'panel-a',
        name: 'agreement',
      },
    })
    const input = wrapper.get('input')

    expect(input.element.checked).toBe(true)
    expect(input.attributes('tabindex')).toBe('1')
    expect(input.attributes('aria-controls')).toBe('panel-a')
    expect(input.attributes('name')).toBe('agreement')
  })

  it('supports bordered style', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: true, border: true } })

    expect(wrapper.classes()).toContain('is-bordered')
  })

  it('supports group model, min/max limits and size', async () => {
    const model = ref(['a'])
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <CheckboxGroup v-model={model.value} min={1} max={2} size="small">
              <Checkbox value="a">A</Checkbox>
              <Checkbox value="b">B</Checkbox>
              <Checkbox value="c">C</Checkbox>
            </CheckboxGroup>
          )
        },
      })
    )
    const inputs = wrapper.findAll('input')

    expect(wrapper.get('.moe-checkbox-group').classes()).toContain('moe-checkbox-group--small')
    expect(wrapper.findAll('.moe-checkbox')[0].classes()).toContain('moe-checkbox--small')
    expect(inputs[0].attributes('disabled')).toBeDefined()

    await inputs[1].setValue(true)
    expect(model.value).toEqual(['a', 'b'])
    await nextTick()
    expect(inputs[2].attributes('disabled')).toBeDefined()
  })

  it('inherits form disabled and form item label id management', async () => {
    const model = reactive({ checked: false })
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form model={model} disabled>
              <FormItem prop="checked" label="Checked">
                <Checkbox v-model={model.checked} />
              </FormItem>
            </Form>
          )
        },
      })
    )
    await nextTick()

    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeDefined()
    expect(wrapper.get('label.moe-form-item__label').attributes('for')).toBe(input.attributes('id'))
  })

  it('validates form item on group change', async () => {
    const model = reactive<{ hobbies: string[] }>({ hobbies: [] })
    const formRef = ref<FormInstance>()
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form
              ref={formRef}
              model={model}
              rules={{
                hobbies: { type: 'array', required: true, message: '请选择', trigger: 'change' },
              }}
            >
              <FormItem prop="hobbies" label="Hobbies">
                <CheckboxGroup v-model={model.hobbies}>
                  <Checkbox value="a">A</Checkbox>
                </CheckboxGroup>
              </FormItem>
            </Form>
          )
        },
      })
    )

    await formRef.value?.validate()
    expect(wrapper.find('.moe-form-item__error').text()).toBe('请选择')

    await wrapper.get('input').setValue(true)
    await nextTick()
    expect(wrapper.find('.moe-form-item__error').exists()).toBe(false)
  })

  it('skips form validation when group validate-event is false', async () => {
    const model = reactive<{ hobbies: string[] }>({ hobbies: [] })
    const formRef = ref<FormInstance>()
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form
              ref={formRef}
              model={model}
              rules={{
                hobbies: { type: 'array', required: true, message: '请选择', trigger: 'change' },
              }}
            >
              <FormItem prop="hobbies" label="Hobbies">
                <CheckboxGroup v-model={model.hobbies} validateEvent={false}>
                  <Checkbox value="a">A</Checkbox>
                </CheckboxGroup>
              </FormItem>
            </Form>
          )
        },
      })
    )

    await formRef.value?.validate()
    expect(wrapper.find('.moe-form-item__error').text()).toBe('请选择')

    await wrapper.get('input').setValue(true)
    await nextTick()
    expect(wrapper.find('.moe-form-item__error').text()).toBe('请选择')
  })

  it('installs checkbox and checkbox group as Vue plugins', () => {
    const app = { component: vi.fn() }

    MoeCheckbox.install?.(app as never)
    MoeCheckboxGroup.install?.(app as never)

    expect(app.component).toHaveBeenCalledWith('MoeCheckbox', expect.any(Object))
    expect(app.component).toHaveBeenCalledWith('MoeCheckboxGroup', expect.any(Object))
  })
})
