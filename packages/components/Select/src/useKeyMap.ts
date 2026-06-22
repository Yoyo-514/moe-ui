export type SelectKeyAction = 'next' | 'prev' | 'select' | 'close'

const keyMap: Record<string, SelectKeyAction> = {
  ArrowDown: 'next',
  ArrowUp: 'prev',
  Enter: 'select',
  Escape: 'close',
}

export function useKeyMap(actions: Record<SelectKeyAction, () => void>) {
  return (event: KeyboardEvent) => {
    const action = keyMap[event.key]
    if (!action) return

    event.preventDefault()
    actions[action]()
  }
}
