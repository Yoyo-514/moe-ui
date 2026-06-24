import { computed } from 'vue'

import { describe, expect, it, vi } from 'vitest'

import { useForm } from '../src/use-form'

import type { FormItemContext, FormProps } from '../src/types'

const createField = (
  overrides: Partial<FormItemContext> & Pick<FormItemContext, 'prop' | 'propString'>
): FormItemContext => ({
  validateState: computed(() => ''),
  validateMessage: computed(() => ''),
  validate: vi.fn(async () => true),
  resetField: vi.fn(),
  clearValidate: vi.fn(),
  scrollToField: vi.fn(),
  ...overrides,
})

describe('useForm', () => {
  it('manages fields and ignores fields without prop', () => {
    const form = useForm({ props: { model: {} } as FormProps })
    const noPropField = createField({ prop: undefined, propString: '' })
    const namedField = createField({ prop: 'name', propString: 'name' })

    form.addField(noPropField)
    expect(form.fields).toHaveLength(0)

    form.addField(namedField)
    expect(form.fields).toEqual([namedField])

    form.removeField(noPropField)
    expect(form.fields).toEqual([namedField])

    form.removeField(namedField)
    expect(form.fields).toHaveLength(0)
  })

  it('builds invalid fields from false and rejected field validation', async () => {
    const form = useForm({ props: { model: {}, scrollToError: true } as FormProps })
    const successField = createField({
      prop: 'success',
      propString: 'success',
      validate: vi.fn(async () => true),
    })
    const failedField = createField({
      prop: 'failed',
      propString: 'failed',
      validateState: computed(() => 'error'),
      validateMessage: computed(() => 'failed message'),
      validate: vi.fn(async () => false),
    })
    const rejectedField = createField({
      prop: 'rejected',
      propString: 'rejected',
      validateState: computed(() => 'error'),
      validateMessage: computed(() => 'rejected message'),
      validate: vi.fn(async () => {
        throw new Error('validator exploded')
      }),
    })

    form.addField(successField)
    form.addField(failedField)
    form.addField(rejectedField)

    const callback = vi.fn()
    await expect(form.validate(callback)).resolves.toBe(false)

    expect(callback.mock.calls[0]?.[0]).toBe(false)
    expect(Object.keys(callback.mock.calls[0]?.[1] ?? {})).toEqual(['failed', 'rejected'])
    expect(failedField.scrollToField).toHaveBeenCalledOnce()
  })

  it('filters reset, clear and scroll operations by props', () => {
    const form = useForm({ props: { model: {} } as FormProps })
    const nameField = createField({ prop: 'name', propString: 'name' })
    const emailField = createField({ prop: ['user', 'email'], propString: 'user.email' })

    form.addField(nameField)
    form.addField(emailField)

    form.resetFields('name')
    expect(nameField.resetField).toHaveBeenCalledOnce()
    expect(emailField.resetField).not.toHaveBeenCalled()

    form.clearValidate([['user', 'email']])
    expect(nameField.clearValidate).not.toHaveBeenCalled()
    expect(emailField.clearValidate).toHaveBeenCalledOnce()

    form.scrollToField(['user', 'email'])
    expect(emailField.scrollToField).toHaveBeenCalledOnce()
  })
})
