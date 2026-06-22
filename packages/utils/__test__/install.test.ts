import { describe, expect, it, vi } from 'vitest'

import { makeInstaller, withInstall } from '../install'

describe('install utilities', () => {
  it('adds install method and registers component by its public name', () => {
    const component = { name: 'MoeDemo' }
    const installed = withInstall(component)
    const app = {
      component: vi.fn(),
    }

    installed.install?.(app as never)

    expect(app.component).toHaveBeenCalledWith('MoeDemo', installed)
  })

  it('creates installer that installs every component plugin', () => {
    const first = { install: vi.fn() }
    const second = { install: vi.fn() }
    const app = {
      use: vi.fn(),
    }

    const installer = makeInstaller([first, second]) as unknown as (target: {
      use: typeof app.use
    }) => void
    installer(app)

    expect(app.use).toHaveBeenCalledWith(first)
    expect(app.use).toHaveBeenCalledWith(second)
    expect(app.use).toHaveBeenCalledTimes(2)
  })
})
