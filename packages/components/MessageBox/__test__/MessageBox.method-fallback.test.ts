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

describe('MoeMessageBox render fallback', () => {
  beforeEach(() => {
    vi.resetModules()
    render.mockClear()
    document.body.innerHTML = ''
  })

  it('rejects close and removes container when vnode component is missing', async () => {
    const { MoeMessageBox, messageBoxInstances } = await import('../src/method')

    await expect(MoeMessageBox('渲染失败')).rejects.toBe('close')
    expect(messageBoxInstances).toHaveLength(0)
    expect(render).toHaveBeenCalledWith(null, expect.any(HTMLDivElement))
    expect(document.body.children).toHaveLength(0)
  })
})
