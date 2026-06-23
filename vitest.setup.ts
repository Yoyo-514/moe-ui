import { vi } from 'vitest'

import { popperMock } from '@moe-ui/test-utils'

vi.doMock('@popperjs/core', () => ({
  createPopper: popperMock.createPopper,
}))

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}
