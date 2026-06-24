/** @vitest-environment jsdom */
import { createSSRApp, nextTick } from 'vue'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { casePaths, loadCase, renderCaseToString } from './shared'

const hydrationMessagePattern = /hydration|mismatch|server rendered|text content does not match/i

function collectHydrationMessages(spy: { mock: { calls: unknown[][] } }) {
  return spy.mock.calls
    .flatMap((args: unknown[]) =>
      args.map((arg: unknown) => (arg instanceof Error ? arg.message : String(arg)))
    )
    .filter((message: string) => hydrationMessagePattern.test(message))
}

describe('Moe UI SSR hydration compatibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it.each(casePaths)('hydrates case %s without mismatch warnings', async (casePath) => {
    const ssrCase = await loadCase(casePath)
    const html = await renderCaseToString(ssrCase.component)
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const app = createSSRApp(ssrCase.component)

    app.mount(container)
    await nextTick()

    expect(collectHydrationMessages(warn)).toEqual([])
    expect(collectHydrationMessages(error)).toEqual([])

    app.unmount()
  })
})
