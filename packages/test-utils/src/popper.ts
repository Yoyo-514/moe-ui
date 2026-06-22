import { vi, type Mock } from 'vitest'

export interface PopperMockInstance {
  destroy: Mock
  setOptions: Mock
  update: Mock
}

export interface PopperMock {
  createPopper: Mock
  popperDestroy: Mock
  popperSetOptions: Mock
  popperUpdate: Mock
  popperInstances: PopperMockInstance[]
  reset(): void
}

const popperDestroy = vi.fn()
const popperSetOptions = vi.fn()
const popperUpdate = vi.fn()
const popperInstances: PopperMockInstance[] = []

const createPopper = vi.fn(() => {
  const instance: PopperMockInstance = {
    destroy: vi.fn(() => popperDestroy()),
    setOptions: popperSetOptions,
    update: popperUpdate,
  }

  popperInstances.push(instance)
  return instance
})

export const popperMock: PopperMock = {
  createPopper,
  popperDestroy,
  popperSetOptions,
  popperUpdate,
  popperInstances,
  reset() {
    createPopper.mockClear()
    popperDestroy.mockClear()
    popperSetOptions.mockClear()
    popperUpdate.mockClear()
    popperInstances.length = 0
  },
}
