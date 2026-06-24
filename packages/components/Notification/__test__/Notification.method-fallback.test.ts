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

describe('MoeNotification render fallback', () => {
  beforeEach(() => {
    vi.resetModules()
    render.mockClear()
    document.body.innerHTML = ''
  })

  it('returns noop handler and cleans render container when vnode component is missing', async () => {
    const { MoeNotification, notificationInstances } = await import('../src/method')
    const handler = MoeNotification('渲染失败')

    expect(() => handler.close()).not.toThrow()
    expect(notificationInstances).toHaveLength(0)
    expect(render).toHaveBeenCalledWith(null, expect.any(HTMLDivElement))
  })
})
