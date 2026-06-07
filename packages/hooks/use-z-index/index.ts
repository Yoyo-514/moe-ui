import { toNumber } from 'lodash-es'

let seed = 2000

export function useZIndex(initialValue?: number) {
  if (initialValue !== undefined) {
    seed = Math.max(toNumber(initialValue) || seed, seed)
  }

  const currentZIndex = () => seed
  const nextZIndex = () => {
    seed += 1
    return seed
  }

  return {
    currentZIndex,
    nextZIndex,
  }
}

export function resetZIndex(value = 2000) {
  seed = value
}
