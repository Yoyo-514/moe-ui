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

describe('MoeUIResolver', () => {
  it.each(componentCases)('resolves %s from component entry %s', (name, entryName) => {
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

  it('ignores unknown components', () => {
    const resolver = MoeUIResolver()

    expect(resolver.resolve('MoeUnknown')).toBeUndefined()
  })
})
