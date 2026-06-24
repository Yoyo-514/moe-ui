import { createApp, defineComponent, h, nextTick, ref } from 'vue'

import { describe, expect, it } from 'vitest'

import { useProp } from '../use-prop'

describe('useProp', () => {
  it('returns a reactive prop value from current component instance', async () => {
    const label = ref('初始文本')
    const Child = defineComponent({
      props: {
        label: String,
      },
      setup() {
        const currentLabel = useProp<string>('label')
        return () => h('span', currentLabel.value)
      },
    })
    const Root = defineComponent({
      setup() {
        return () => h(Child, { label: label.value })
      },
    })
    const container = document.createElement('div')
    const app = createApp(Root)

    app.mount(container)
    expect(container.textContent).toBe('初始文本')

    label.value = '更新文本'
    await nextTick()
    expect(container.textContent).toBe('更新文本')

    app.unmount()
  })

  it('throws when used outside component setup', () => {
    expect(() => useProp('label')).toThrow('useProp must be used within a component')
  })
})
