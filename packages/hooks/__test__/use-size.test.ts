import { computed, createApp, defineComponent, h, nextTick, provide, ref } from 'vue'

import { describe, expect, it } from 'vitest'

import { SIZE_INJECTION_KEY, useGlobalSize, useSizeProp } from '../use-size'

describe('useSize', () => {
  it('validates component size prop values', () => {
    expect(useSizeProp.validator?.('small')).toBe(true)
    expect(useSizeProp.validator?.('large')).toBe(true)
    expect(useSizeProp.validator?.('invalid')).toBe(false)
  })

  it('returns injected global size and falls back to empty string', async () => {
    const size = ref<'small' | 'large'>('small')
    const Child = defineComponent({
      setup() {
        const globalSize = useGlobalSize()
        return () => h('span', globalSize.value)
      },
    })
    const Root = defineComponent({
      setup() {
        provide(SIZE_INJECTION_KEY, { size: computed(() => size.value) })
        return () => h(Child)
      },
    })
    const container = document.createElement('div')
    const app = createApp(Root)

    app.mount(container)
    expect(container.textContent).toBe('small')

    size.value = 'large'
    await nextTick()
    expect(container.textContent).toBe('large')
    app.unmount()

    const fallbackContainer = document.createElement('div')
    const fallbackApp = createApp(Child)
    fallbackApp.mount(fallbackContainer)
    expect(fallbackContainer.textContent).toBe('')
    fallbackApp.unmount()
  })
})
