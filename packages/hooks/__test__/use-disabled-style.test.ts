import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import { useDisabledStyle } from '../use-disabled-style'

describe('useDisabledStyle', () => {
  it('returns enabled semantic style by default', () => {
    const disabled = ref(false)
    const { ariaDisabled, disabledClass, disabledTabIndex, isDisabled } = useDisabledStyle(disabled)

    expect(isDisabled.value).toBe(false)
    expect(disabledClass.value).toEqual({ 'is-disabled': false })
    expect(ariaDisabled.value).toBe('false')
    expect(disabledTabIndex.value).toBe(0)
  })

  it('updates class, aria and tabindex when disabled changes', () => {
    const disabled = ref(false)
    const { ariaDisabled, disabledClass, disabledTabIndex, isDisabled } = useDisabledStyle(disabled)

    disabled.value = true

    expect(isDisabled.value).toBe(true)
    expect(disabledClass.value).toEqual({ 'is-disabled': true })
    expect(ariaDisabled.value).toBe('true')
    expect(disabledTabIndex.value).toBe(-1)
  })

  it('supports getter value', () => {
    const disabled = ref(true)
    const { ariaDisabled, disabledTabIndex, isDisabled } = useDisabledStyle(() => disabled.value)

    expect(isDisabled.value).toBe(true)
    expect(ariaDisabled.value).toBe('true')
    expect(disabledTabIndex.value).toBe(-1)
  })

  it('casts non-boolean values with Boolean semantics', () => {
    const disabled = ref<string | undefined>('disabled')
    const { ariaDisabled, disabledClass, disabledTabIndex, isDisabled } = useDisabledStyle(
      () => disabled.value as unknown as boolean
    )

    expect(isDisabled.value).toBe(true)
    expect(disabledClass.value).toEqual({ 'is-disabled': true })
    expect(ariaDisabled.value).toBe('true')
    expect(disabledTabIndex.value).toBe(-1)

    disabled.value = undefined
    expect(isDisabled.value).toBe(false)
  })
})
