import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Button from './Button.vue'
import ButtonGroup from './ButtonGroup.vue'
import type { ButtonSize, ButtonType } from './types'

describe('ButtonGroup.vue', () => {
  it('should render as a button group', () => {
    const wrapper = mount(() => (
      <ButtonGroup>
        <Button>Prev</Button>
        <Button>Next</Button>
      </ButtonGroup>
    ))

    expect(wrapper.classes()).toContain('moe-button-group')
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.findAll('.moe-button')).toHaveLength(2)
  })

  it.each<ButtonType>(['primary', 'success', 'warning', 'danger', 'info', 'text'])(
    'should pass type %s to child buttons',
    (type) => {
      const wrapper = mount(() => (
        <ButtonGroup type={type}>
          <Button>Prev</Button>
          <Button>Next</Button>
        </ButtonGroup>
      ))

      wrapper.findAll('.moe-button').forEach((button) => {
        expect(button.classes()).toContain(`moe-button--${type}`)
      })
    }
  )

  it.each<ButtonSize>(['large', 'default', 'small'])(
    'should pass size %s to child buttons',
    (size) => {
      const wrapper = mount(() => (
        <ButtonGroup size={size}>
          <Button>Prev</Button>
          <Button>Next</Button>
        </ButtonGroup>
      ))

      wrapper.findAll('.moe-button').forEach((button) => {
        expect(button.classes()).toContain(`moe-button--${size}`)
      })
    }
  )

  it('should let child button props override group props', () => {
    const wrapper = mount(() => (
      <ButtonGroup type="primary" size="small">
        <Button type="danger" size="large">
          Delete
        </Button>
      </ButtonGroup>
    ))

    const button = wrapper.get('.moe-button')
    expect(button.classes()).toContain('moe-button--danger')
    expect(button.classes()).toContain('moe-button--large')
    expect(button.classes()).not.toContain('moe-button--primary')
    expect(button.classes()).not.toContain('moe-button--small')
  })

  it('should pass disabled state to child buttons', async () => {
    const wrapper = mount(() => (
      <ButtonGroup disabled>
        <Button>Disabled</Button>
      </ButtonGroup>
    ))

    const button = wrapper.get('button')
    expect(button.classes()).toContain('is-disabled')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')
    expect(wrapper.findComponent(Button).emitted('click')).toBeUndefined()
  })
})
