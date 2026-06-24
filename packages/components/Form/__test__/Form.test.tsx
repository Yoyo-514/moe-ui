/* eslint-disable vue/one-component-per-file */
import { defineComponent, h, nextTick, reactive, ref } from 'vue'

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

  it('renders label/error slots, layout classes and form-level label options', async () => {
    const model = reactive({ name: '' })
    const formRef = ref<FormInstance>()
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Form,
              {
                ref: formRef,
                model,
                labelPosition: 'top',
                labelWidth: 80,
                labelSuffix: '：',
                inlineMessage: true,
                hideRequiredAsterisk: true,
                requireAsteriskPosition: 'left',
                rules: {
                  name: { required: true, message: '请输入名称' },
                },
              },
              {
                default: () =>
                  h(
                    FormItem,
                    {
                      prop: 'name',
                      label: 'Name',
                      for: 'name-input',
                    },
                    {
                      label: ({ label }: { label: string }) =>
                        h('span', { class: 'custom-label' }, label),
                      default: () => <Input id="name-input" v-model={model.name} />,
                      error: ({ error }: { error: string }) =>
                        h('span', { class: 'custom-error' }, error),
                    }
                  ),
              }
            )
        },
      })
    )

    const item = wrapper.get('.moe-form-item')
    const label = wrapper.get('.moe-form-item__label')
    expect(item.classes()).toContain('moe-form-item--label-top')
    expect(item.classes()).toContain('is-inline-message')
    expect(item.classes()).toContain('asterisk-left')
    expect(item.classes()).toContain('is-no-asterisk')
    expect(label.attributes('for')).toBe('name-input')
    expect(label.attributes('style')).toContain('width: 80px')
    expect(wrapper.get('.custom-label').text()).toBe('Name：')

    await formRef.value?.validate()
    expect(wrapper.get('.custom-error').text()).toBe('请输入名称')
  })

  it('supports external error, validate status and hidden message', async () => {
    const wrapper = mount(FormItem, {
      props: {
        label: 'Name',
        error: '外部错误',
        showMessage: false,
        validateStatus: 'success',
        inlineMessage: true,
        labelPosition: 'left',
        labelWidth: '6em',
      },
      slots: {
        default: () => <Input modelValue="" />,
      },
    })

    expect(wrapper.get('.moe-form-item').classes()).toContain('is-success')
    expect(wrapper.get('.moe-form-item').classes()).toContain('is-inline-message')
    expect(wrapper.get('.moe-form-item__label').attributes('style')).toContain('width: 6em')
    expect(wrapper.find('.moe-form-item__error').exists()).toBe(false)

    await wrapper.setProps({ showMessage: true, validateStatus: 'error' })
    expect(wrapper.get('.moe-form-item').classes()).toContain('is-error')
    expect(wrapper.get('.moe-form-item__error').text()).toBe('外部错误')

    await wrapper.setProps({ error: '' })
    expect(wrapper.find('.moe-form-item__error').exists()).toBe(false)
  })

  it('renders required item from required prop without form rules', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: 'Standalone',
        required: true,
      },
      slots: {
        default: () => <Input modelValue="" />,
      },
    })

    expect(wrapper.get('.moe-form-item').classes()).toContain('is-required')
    wrapper.unmount()
  })

  it('validates prop item without rules as successful and invokes callback', async () => {
    const itemRef = ref<FormItemInstance>()
    mount(
      defineComponent({
        setup() {
          return () => (
            <Form model={{ name: '' }}>
              <FormItem ref={itemRef} prop="name">
                <Input modelValue="" />
              </FormItem>
            </Form>
          )
        },
      })
    )
    const callback = vi.fn()

    await expect(itemRef.value?.validate('change', callback)).resolves.toBe(true)
    expect(callback).toHaveBeenCalledWith(true)
  })

  it('validates no-prop item as successful and invokes callback', async () => {
    const itemRef = ref<FormItemInstance>()
    mount(
      defineComponent({
        setup() {
          return () => (
            <FormItem ref={itemRef} rules={{ required: true, message: '不会触发' }}>
              <Input modelValue="" />
            </FormItem>
          )
        },
      })
    )
    const callback = vi.fn()

    await expect(itemRef.value?.validate('change', callback)).resolves.toBe(true)
    expect(callback).toHaveBeenCalledWith(true)
  })

  it('updates field registration when prop changes and required prop overrides rules', async () => {
    const model = reactive({ name: '', email: '' })
    const prop = ref<'name' | 'email'>('name')
    const required = ref(false)
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
              <FormItem prop={prop.value} label="Dynamic" required={required.value}>
                <Input v-model={model[prop.value]} />
              </FormItem>
            </Form>
          )
        },
      })
    )

    expect(wrapper.get('.moe-form-item').classes()).not.toContain('is-required')
    expect(await formRef.value?.validate()).toBe(true)

    prop.value = 'email'
    required.value = true
    await nextTick()
    expect(wrapper.get('.moe-form-item').classes()).toContain('is-required')
    expect(await formRef.value?.validate()).toBe(false)
    expect(wrapper.get('.moe-form-item__error').text()).toBe('email required')
  })

  it('keeps reset safe for no-prop and missing nested targets', async () => {
    const noPropRef = ref<FormItemInstance>()
    const nestedRef = ref<FormItemInstance>()
    const emptyPathRef = ref<FormItemInstance>()
    const emptyKeyRef = ref<FormItemInstance>()
    const model = reactive({ user: null as null | { name?: string }, plain: 'value' })

    mount(
      defineComponent({
        setup() {
          return () => (
            <Form model={model}>
              <FormItem ref={noPropRef}>
                <Input modelValue="" />
              </FormItem>
              <FormItem ref={nestedRef} prop="user.name">
                <Input modelValue="" />
              </FormItem>
              <FormItem ref={emptyPathRef} prop={[]}>
                <Input modelValue="" />
              </FormItem>
              <FormItem ref={emptyKeyRef} prop={['']}>
                <Input modelValue="" />
              </FormItem>
            </Form>
          )
        },
      })
    )

    expect(() => noPropRef.value?.resetField()).not.toThrow()
    expect(() => nestedRef.value?.resetField()).not.toThrow()
    expect(() => emptyPathRef.value?.resetField()).not.toThrow()
    expect(() => emptyKeyRef.value?.resetField()).not.toThrow()
    expect(model.user).toBeNull()
  })

  it('clones primitive values when structuredClone is unavailable', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'structuredClone')
    Object.defineProperty(globalThis, 'structuredClone', {
      configurable: true,
      value: undefined,
    })

    try {
      const model = reactive({ name: 'initial' })
      const formRef = ref<FormInstance>()
      mount(
        defineComponent({
          setup() {
            return () => (
              <Form ref={formRef} model={model}>
                <FormItem prop="name" label="Name">
                  <Input v-model={model.name} />
                </FormItem>
              </Form>
            )
          },
        })
      )

      model.name = 'changed'
      formRef.value?.resetFields('name')
      await nextTick()
      expect(model.name).toBe('initial')
    } finally {
      if (descriptor) Object.defineProperty(globalThis, 'structuredClone', descriptor)
    }
  })

  it('clones arrays and objects when structuredClone is unavailable', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'structuredClone')
    Object.defineProperty(globalThis, 'structuredClone', {
      configurable: true,
      value: undefined,
    })

    try {
      const model = reactive({ tags: ['a'], profile: { name: 'initial' } })
      const formRef = ref<FormInstance>()
      mount(
        defineComponent({
          setup() {
            return () => (
              <Form ref={formRef} model={model}>
                <FormItem prop="tags" label="Tags">
                  <Input modelValue={model.tags.join(',')} />
                </FormItem>
                <FormItem prop="profile" label="Profile">
                  <Input modelValue={model.profile.name} />
                </FormItem>
              </Form>
            )
          },
        })
      )

      const initialTags = model.tags
      const initialProfile = model.profile
      model.tags = ['b']
      model.profile = { name: 'changed' }
      formRef.value?.resetFields()
      await nextTick()

      expect(model.tags).toEqual(['a'])
      expect(model.tags).not.toBe(initialTags)
      expect(model.profile).toEqual({ name: 'initial' })
      expect(model.profile).not.toBe(initialProfile)
    } finally {
      if (descriptor) Object.defineProperty(globalThis, 'structuredClone', descriptor)
    }
  })

  it('falls back gracefully when structuredClone fails during reset', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'structuredClone')
    Object.defineProperty(globalThis, 'structuredClone', {
      configurable: true,
      value: () => {
        throw new Error('clone failed')
      },
    })

    try {
      const model = reactive({ profile: { name: 'initial' } })
      const formRef = ref<FormInstance>()
      mount(
        defineComponent({
          setup() {
            return () => (
              <Form ref={formRef} model={model}>
                <FormItem prop="profile" label="Profile">
                  <Input modelValue={model.profile.name} />
                </FormItem>
              </Form>
            )
          },
        })
      )

      const original = model.profile
      model.profile = { name: 'changed' }
      formRef.value?.resetFields('profile')
      await nextTick()

      expect(model.profile).toBe(original)
    } finally {
      if (descriptor) Object.defineProperty(globalThis, 'structuredClone', descriptor)
    }
  })

  it('supports array prop paths, callbacks, reset subset and scrollToField', async () => {
    const model = reactive({ user: { name: 'initial' }, other: '' })
    const formRef = ref<FormInstance>()
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView

    const wrapper = mount(
      defineComponent({
        setup() {
          return () => (
            <Form
              ref={formRef}
              model={model}
              rules={{
                'user.name': { required: true, message: 'name required' },
                other: { required: true, message: 'other required' },
              }}
            >
              <FormItem prop={['user', 'name']} label="Name">
                <Input v-model={model.user.name} />
              </FormItem>
              <FormItem prop="other" label="Other">
                <Input v-model={model.other} />
              </FormItem>
            </Form>
          )
        },
      })
    )

    model.user.name = ''
    const callback = vi.fn()
    await expect(formRef.value?.validateField([['user', 'name']], callback)).resolves.toBe(false)
    expect(callback.mock.calls[0]?.[0]).toBe(false)
    expect(Object.keys(callback.mock.calls[0]?.[1] ?? {})).toEqual(['user.name'])
    expect(wrapper.findAll('.moe-form-item__error')).toHaveLength(1)

    model.user.name = 'changed'
    model.other = 'changed'
    formRef.value?.resetFields([['user', 'name']])
    await nextTick()
    expect(model.user.name).toBe('initial')
    expect(model.other).toBe('changed')

    formRef.value?.scrollToField(['user', 'name'])
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center', behavior: 'smooth' })

    formRef.value?.clearValidate()
    await nextTick()
    expect(wrapper.find('.moe-form-item__error').exists()).toBe(false)
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
