import { beforeEach, describe, expect, it, vi } from 'vitest'

const render = vi.fn()

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>()
  return {
    ...actual,
    createVNode: vi.fn(() => ({ component: null })),
    render,
  }
})

describe('MoeMessage render fallback', () => {
  beforeEach(() => {
    vi.resetModules()
    render.mockClear()
    document.body.innerHTML = ''
  })

  it('returns noop handler and cleans render container when vnode component is missing', async () => {
    const { MoeMessage, messageInstances } = await import('../src/method')
    const handler = MoeMessage('渲染失败')

    expect(() => handler.close()).not.toThrow()
    expect(messageInstances).toHaveLength(0)
    expect(render).toHaveBeenCalledWith(null, expect.any(HTMLDivElement))
  })
})
