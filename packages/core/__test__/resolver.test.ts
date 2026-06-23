import { describe, expect, it } from 'vitest'

import { MoeUIResolver } from '../resolver'

const componentCases = [
  ['MoeButton', 'Button'],
  ['MoeButtonGroup', 'Button'],
  ['MoeCollapseItem', 'Collapse'],
  ['MoeConfigProvider', 'ConfigProvider'],
  ['MoeDropdownItem', 'Dropdown'],
  ['MoeDropdownMenu', 'Dropdown'],
  ['MoeOption', 'Select'],
] as const

const autoImportCases = [
  ['MoeMessage', 'Message'],
  ['MoeNotification', 'Notification'],
  ['MoeMessageBox', 'MessageBox'],
  ['MoeLoading', 'Loading'],
] as const

describe('MoeUIResolver', () => {
  it('returns a shared resolver compatible with Components and AutoImport', () => {
    const resolver = MoeUIResolver()

    expect(resolver).not.toHaveProperty('type')
    expect(typeof resolver.resolve).toBe('function')
  })

  it.each(componentCases)('resolves component %s from entry %s', (name, entryName) => {
    const resolver = MoeUIResolver()

    expect(resolver.resolve(name)).toEqual({
      name,
      from: `moe-cute-ui/es/components/${entryName}`,
      sideEffects: `moe-cute-ui/es/components/${entryName}/style/css`,
    })
  })

  it.each(autoImportCases)('resolves function API %s from entry %s', (name, entryName) => {
    const resolver = MoeUIResolver()

    expect(resolver.resolve(name)).toEqual({
      name,
      from: `moe-cute-ui/es/components/${entryName}`,
      sideEffects: `moe-cute-ui/es/components/${entryName}/style/css`,
    })
  })

  it('disables style side effects when importStyle is false', () => {
    const resolver = MoeUIResolver({ importStyle: false })

    expect(resolver.resolve('MoeButton')).toEqual({
      name: 'MoeButton',
      from: 'moe-cute-ui/es/components/Button',
      sideEffects: undefined,
    })
  })

  it('ignores unknown imports', () => {
    const resolver = MoeUIResolver()

    expect(resolver.resolve('MoeUnknown')).toBeUndefined()
  })
})
