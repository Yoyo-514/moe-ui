import { onUnmounted } from 'vue'

import { isFunction, toNumber } from 'lodash-es'

export type TimeoutCallback = () => void

export function useTimeout() {
  let timer: ReturnType<typeof setTimeout> | undefined

  const clear = () => {
    if (!timer) return

    clearTimeout(timer)
    timer = undefined
  }

  const start = (callback: TimeoutCallback, delay = 0) => {
    clear()
    if (!isFunction(callback)) return

    timer = setTimeout(
      () => {
        timer = undefined
        callback()
      },
      Math.max(toNumber(delay) || 0, 0)
    )
  }

  onUnmounted(clear)

  return {
    start,
    clear,
  }
}
