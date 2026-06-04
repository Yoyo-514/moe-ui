type CollapseTransitionElement = Element & HTMLElement

const nextFrame = (callback: () => void) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback)
  })
}

const resetTransitionStyle = (element: CollapseTransitionElement) => {
  element.style.height = ''
  element.style.overflow = ''
}

export const collapseTransitionEvents = {
  beforeEnter(element: Element) {
    const el = element as CollapseTransitionElement
    el.style.height = '0'
    el.style.overflow = 'hidden'
  },
  enter(element: Element) {
    const el = element as CollapseTransitionElement
    nextFrame(() => {
      el.style.height = `${el.scrollHeight}px`
    })
  },
  afterEnter(element: Element) {
    resetTransitionStyle(element as CollapseTransitionElement)
  },
  beforeLeave(element: Element) {
    const el = element as CollapseTransitionElement
    el.style.height = `${el.scrollHeight}px`
    el.style.overflow = 'hidden'
  },
  leave(element: Element) {
    const el = element as CollapseTransitionElement
    nextFrame(() => {
      el.style.height = '0'
    })
  },
  afterLeave(element: Element) {
    resetTransitionStyle(element as CollapseTransitionElement)
  },
}
