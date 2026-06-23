/* eslint-disable vue/one-component-per-file */
import { defineComponent, nextTick, reactive, ref } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Input from '../../Input/src/Input.vue'
import Switch from '../../Switch/src/Switch.vue'
import { MoeForm, MoeFormItem } from '../index'
import Form from '../src/Form.vue'
import FormItem from '../src/FormItem.vue'

import type { FormInstance, FormItemInstance, FormRules } from '../src/types'

const mountForm = (
  options: {
    model?: Record<string, unknown>
    rules?: FormRules
    scrollToError?: boolean
  } = {}
) => {
  const model = reactive(options.model ?? { name: '', enabled: false })
  const formRef = ref<FormInstance>()

  const wrapper = mount(
    defineComponent({
      setup() {
        return () => (
          <Form
            ref={formRef}
            model={model}
            rules={options.rules}
            scrollToError={options.scrollToError}
          >
            <FormItem prop="name" label="Name">
              <Input v-model={model.name} />
            </FormItem>
          </Form>
        )
      },
    })
  )

  return { wrapper, model, formRef }
}

describe('MoeForm', () => {
  it('renders default slot, label and required asterisk', () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        rules: {
          name: { required: true, message: '请输入名称' },
        },
      },
      slots: {
        default: () => (
          <FormItem prop="name" label="Name">
            <Input modelValue="" />
          </FormItem>
        ),
      },
    })

    expect(wrapper.classes()).toContain('moe-form')
    expect(wrapper.get('.moe-form-item__label').text()).toBe('Name')
    expect(wrapper.get('.moe-form-item').classes()).toContain('is-required')
  })

  it('validates all fields and emits validate event', async () => {
    const { wrapper, formRef } = mountForm({
      rules: {
        name: { required: true, message: '请输入名称' },
      },
    })

    const result = await formRef.value?.validate()

    expect(result).toBe(false)
    expect(wrapper.get('.moe-form-item__error').text()).toBe('请输入名称')
    expect(wrapper.findComponent(Form).emitted('validate')?.[0]).toEqual([
      'name',
      false,
      '请输入名称',
    ])
  })

  it('validates trigger-specific rules through input blur and change', async () => {
    const model = reactive({ name: '' })
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form
              model={model}
              rules={{
                name: [
                  { required: true, message: 'blur required', trigger: 'blur' },
                  { min: 3, message: 'change min', trigger: 'change' },
                ],
              }}
            >
              <FormItem prop="name" label="Name">
                <Input v-model={model.name} />
              </FormItem>
            </Form>
          )
        },
      })
    )

    const input = wrapper.get('input')
    await input.trigger('blur')
    await nextTick()
    expect(wrapper.get('.moe-form-item__error').text()).toBe('blur required')

    await input.setValue('ab')
    await input.trigger('change')
    await nextTick()
    expect(wrapper.get('.moe-form-item__error').text()).toBe('change min')
  })

  it('resets fields and clears validation', async () => {
    const { wrapper, model, formRef } = mountForm({
      model: { name: 'initial' },
      rules: {
        name: { required: true, message: '请输入名称' },
      },
    })

    model.name = ''
    await formRef.value?.validate()
    expect(wrapper.find('.moe-form-item__error').exists()).toBe(true)

    formRef.value?.resetFields()
    await nextTick()
    expect(model.name).toBe('initial')
    expect(wrapper.find('.moe-form-item__error').exists()).toBe(false)
  })

  it('validates a specific field and clears specified fields', async () => {
    const model = reactive({ name: '', email: '' })
    const formRef = ref<FormInstance>()
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form
              ref={formRef}
              model={model}
              rules={{
                name: { required: true, message: 'name required' },
                email: { required: true, message: 'email required' },
              }}
            >
              <FormItem prop="name" label="Name">
                <Input v-model={model.name} />
              </FormItem>
              <FormItem prop="email" label="Email">
                <Input v-model={model.email} />
              </FormItem>
            </Form>
          )
        },
      })
    )

    await formRef.value?.validateField('email')
    expect(wrapper.findAll('.moe-form-item__error')).toHaveLength(1)
    expect(wrapper.get('.moe-form-item__error').text()).toBe('email required')

    formRef.value?.clearValidate('email')
    await nextTick()
    expect(wrapper.find('.moe-form-item__error').exists()).toBe(false)
  })

  it('scrolls to first error when scrollToError is enabled', async () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { formRef } = mountForm({
      rules: {
        name: { required: true, message: '请输入名称' },
      },
      scrollToError: true,
    })

    await formRef.value?.validate()
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center', behavior: 'smooth' })
  })

  it('exposes form item validation state and methods', async () => {
    const itemRef = ref<FormItemInstance>()
    const model = reactive({ name: '' })
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form model={model} rules={{ name: { required: true, message: 'required' } }}>
              <FormItem ref={itemRef} prop="name" label="Name">
                <Input v-model={model.name} />
              </FormItem>
            </Form>
          )
        },
      })
    )

    expect(await itemRef.value?.validate()).toBe(false)
    expect((itemRef.value as any)?.validateState).toBe('error')
    expect((itemRef.value as any)?.validateMessage).toBe('required')

    itemRef.value?.clearValidate()
    await nextTick()
    expect(wrapper.find('.moe-form-item__error').exists()).toBe(false)
  })

  it('validates switch change through form item context', async () => {
    const model = reactive({ enabled: false })
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form
              model={model}
              rules={{
                enabled: { type: 'enum', enum: [true], message: '请开启', trigger: 'change' },
              }}
            >
              <FormItem prop="enabled" label="Enabled">
                <Switch v-model={model.enabled} />
              </FormItem>
            </Form>
          )
        },
      })
    )

    await wrapper.get('button').trigger('click')
    await nextTick()
    expect(wrapper.find('.moe-form-item__error').exists()).toBe(false)
  })

  it('passes disabled from form to child input and switch', () => {
    const model = reactive({ name: '', enabled: false })
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form model={model} disabled>
              <FormItem prop="name" label="Name">
                <Input v-model={model.name} />
              </FormItem>
              <FormItem prop="enabled" label="Enabled">
                <Switch v-model={model.enabled} />
              </FormItem>
            </Form>
          )
        },
      })
    )

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.moe-input').classes()).toContain('is-disabled')
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.moe-switch').classes()).toContain('is-disabled')
  })

  it('lets explicit child disabled override form disabled', () => {
    const model = reactive({ name: '', enabled: false })
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form model={model} disabled>
              <FormItem prop="name" label="Name">
                <Input v-model={model.name} disabled={false} />
              </FormItem>
              <FormItem prop="enabled" label="Enabled">
                <Switch v-model={model.enabled} disabled={false} />
              </FormItem>
            </Form>
          )
        },
      })
    )

    expect(wrapper.get('input').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('.moe-input').classes()).not.toContain('is-disabled')
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('.moe-switch').classes()).not.toContain('is-disabled')
  })

  it('passes size from form to child input and switch', () => {
    const model = reactive({ name: '', enabled: false })
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form model={model} size="small">
              <FormItem prop="name" label="Name">
                <Input v-model={model.name} />
              </FormItem>
              <FormItem prop="enabled" label="Enabled">
                <Switch v-model={model.enabled} />
              </FormItem>
            </Form>
          )
        },
      })
    )

    expect(wrapper.get('.moe-input').classes()).toContain('moe-input--small')
    expect(wrapper.get('.moe-switch').classes()).toContain('moe-switch--small')
  })

  it('lets explicit child size override form size', () => {
    const model = reactive({ name: '', enabled: false })
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form model={model} size="small">
              <FormItem prop="name" label="Name">
                <Input v-model={model.name} size="large" />
              </FormItem>
              <FormItem prop="enabled" label="Enabled">
                <Switch v-model={model.enabled} size="large" />
              </FormItem>
            </Form>
          )
        },
      })
    )

    expect(wrapper.get('.moe-input').classes()).toContain('moe-input--large')
    expect(wrapper.get('.moe-switch').classes()).toContain('moe-switch--large')
  })

  it('installs form and form item as Vue plugins', () => {
    const app = { component: vi.fn() }

    MoeForm.install?.(app as never)
    MoeFormItem.install?.(app as never)

    expect(app.component).toHaveBeenCalledWith('MoeForm', expect.any(Object))
    expect(app.component).toHaveBeenCalledWith('MoeFormItem', expect.any(Object))
  })
})
