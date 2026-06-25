import { defineComponent, nextTick, reactive, ref } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Form from '../../Form/src/Form.vue'
import FormItem from '../../Form/src/FormItem.vue'
import { MoeRadio, MoeRadioGroup } from '../index'
import Radio from '../src/Radio.vue'
import RadioGroup from '../src/RadioGroup.vue'

import type { FormInstance } from '../../Form/src/types'

describe('MoeRadio', () => {
  it('renders label and updates standalone model', async () => {
    const wrapper = mount(Radio, { props: { modelValue: 'a', value: 'b', label: 'B' } })
    const input = wrapper.get('input')

    expect(wrapper.text()).toContain('B')
    expect(input.element.checked).toBe(false)

    await input.setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['b'])
  })

  it('supports bordered style', () => {
    const wrapper = mount(Radio, { props: { modelValue: 'a', value: 'a', border: true } })

    expect(wrapper.classes()).toContain('is-bordered')
  })

  it('exposes focus method', () => {
    const wrapper = mount(Radio, { props: { modelValue: 'a', value: 'b' } })
    const focus = vi.spyOn(wrapper.get('input').element, 'focus')

    wrapper.vm.focus()

    expect(focus).toHaveBeenCalled()
  })

  it('supports radio group model, name, disabled and size', async () => {
    const model = ref('a')
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <RadioGroup
              v-model={model.value}
              id="gender-group"
              ariaLabel="Gender"
              name="gender"
              size="small"
              disabled
            >
              <Radio value="a">A</Radio>
              <Radio value="b">B</Radio>
            </RadioGroup>
          )
        },
      })
    )
    const inputs = wrapper.findAll('input')

    expect(wrapper.get('.moe-radio-group').attributes('id')).toBe('gender-group')
    expect(wrapper.get('.moe-radio-group').attributes('aria-label')).toBe('Gender')
    expect(wrapper.get('.moe-radio-group').attributes('role')).toBe('radiogroup')
    expect(wrapper.get('.moe-radio-group').classes()).toContain('moe-radio-group--small')
    expect(wrapper.findAll('.moe-radio')[0].classes()).toContain('moe-radio--small')
    expect(inputs[0].attributes('name')).toBe('gender')
    expect(inputs[0].attributes('disabled')).toBeDefined()
    expect(inputs[0].element.checked).toBe(true)
  })

  it('changes radio group value', async () => {
    const model = ref('a')
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <RadioGroup v-model={model.value}>
              <Radio value="a">A</Radio>
              <Radio value="b">B</Radio>
            </RadioGroup>
          )
        },
      })
    )

    await wrapper.findAll('input')[1].setValue(true)

    expect(model.value).toBe('b')
  })

  it('inherits form disabled and form item label id management', async () => {
    const model = reactive({ type: 'a' })
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form model={model} disabled>
              <FormItem prop="type" label="Type">
                <Radio v-model={model.type} value="a">
                  A
                </Radio>
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
    const model = reactive({ type: '' })
    const formRef = ref<FormInstance>()
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form
              ref={formRef}
              model={model}
              rules={{ type: { required: true, message: '请选择类型', trigger: 'change' } }}
            >
              <FormItem prop="type" label="Type">
                <RadioGroup v-model={model.type}>
                  <Radio value="a">A</Radio>
                </RadioGroup>
              </FormItem>
            </Form>
          )
        },
      })
    )

    await formRef.value?.validate()
    expect(wrapper.find('.moe-form-item__error').text()).toBe('请选择类型')

    await wrapper.get('input').setValue(true)
    await nextTick()
    expect(wrapper.find('.moe-form-item__error').exists()).toBe(false)
  })

  it('skips form validation when group validate-event is false', async () => {
    const model = reactive({ type: '' })
    const formRef = ref<FormInstance>()
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form
              ref={formRef}
              model={model}
              rules={{ type: { required: true, message: '请选择类型', trigger: 'change' } }}
            >
              <FormItem prop="type" label="Type">
                <RadioGroup v-model={model.type} validateEvent={false}>
                  <Radio value="a">A</Radio>
                </RadioGroup>
              </FormItem>
            </Form>
          )
        },
      })
    )

    await formRef.value?.validate()
    expect(wrapper.find('.moe-form-item__error').text()).toBe('请选择类型')

    await wrapper.get('input').setValue(true)
    await nextTick()
    expect(wrapper.find('.moe-form-item__error').text()).toBe('请选择类型')
  })

  it('installs radio and radio group as Vue plugins', () => {
    const app = { component: vi.fn() }

    MoeRadio.install?.(app as never)
    MoeRadioGroup.install?.(app as never)

    expect(app.component).toHaveBeenCalledWith('MoeRadio', expect.any(Object))
    expect(app.component).toHaveBeenCalledWith('MoeRadioGroup', expect.any(Object))
  })
})
