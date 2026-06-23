import { nextTick } from 'vue'

import { vi } from 'vitest'

export const flushRender = async () => {
  await nextTick()
  await nextTick()
}

export const flushTimers = async () => {
  await vi.runOnlyPendingTimersAsync()
  await flushRender()
}
