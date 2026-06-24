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

describe('Loading service render fallback', () => {
  beforeEach(() => {
    vi.resetModules()
    render.mockClear()
    document.body.innerHTML = ''
  })

  it('returns noop instance and removes container when vnode component is missing', async () => {
    const { service } = await import('../src/method')
    const instance = service({ text: '渲染失败' })

    expect(() => instance.close()).not.toThrow()
    expect(render).toHaveBeenCalledWith(null, expect.any(HTMLDivElement))
    expect(document.body.children).toHaveLength(0)
  })
})
