import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { MoeConfigProvider, useGlobalConfig } from '../index'

const Consumer = defineComponent({
  setup() {
    const config = useGlobalConfig()
    const namespace = useGlobalConfig('namespace', 'moe')
    const size = useGlobalConfig('size')
    const zIndex = useGlobalConfig('zIndex')

    return () => (
      <div class="consumer">
        <span class="namespace">{namespace.value}</span>
        <span class="size">{size.value}</span>
        <span class="z-index">{zIndex.value}</span>
        <span class="config">{JSON.stringify(config.value)}</span>
      </div>
    )
  },
})

describe('ConfigProvider.vue', () => {
  it('falls back to default namespace without provider', () => {
    const wrapper = mount(Consumer)

    expect(wrapper.get('.namespace').text()).toBe('moe')
    expect(wrapper.get('.size').text()).toBe('')
    expect(wrapper.get('.z-index').text()).toBe('')
  })

  it('provides namespace, size and zIndex to descendants', () => {
    const wrapper = mount(MoeConfigProvider, {
      props: {
        namespace: 'moe-test',
        size: 'small',
        zIndex: 3000,
      },
      slots: {
        default: () => <Consumer />,
      },
    })

    expect(wrapper.get('.namespace').text()).toBe('moe-test')
    expect(wrapper.get('.size').text()).toBe('small')
    expect(wrapper.get('.z-index').text()).toBe('3000')
  })

  it('merges nested config providers', () => {
    const wrapper = mount(MoeConfigProvider, {
      props: {
        namespace: 'outer',
        size: 'large',
        zIndex: 2000,
      },
      slots: {
        default: () => h(MoeConfigProvider, { size: 'small' }, { default: () => <Consumer /> }),
      },
    })

    expect(wrapper.get('.namespace').text()).toBe('outer')
    expect(wrapper.get('.size').text()).toBe('small')
    expect(wrapper.get('.z-index').text()).toBe('2000')
  })

  it('exposes config through scoped slot', () => {
    const wrapper = mount(MoeConfigProvider, {
      props: { namespace: 'scoped', size: 'large' },
      slots: {
        default: (scope: Record<string, unknown>) =>
          h('span', { class: 'result' }, JSON.stringify(scope.config)),
      },
    })

    const parsed = JSON.parse(wrapper.get('.result').text())

    expect(parsed.namespace).toBe('scoped')
    expect(parsed.size).toBe('large')
  })

  it('installs as a Vue plugin', () => {
    const app = { component: vi.fn() }

    MoeConfigProvider.install?.(app as never)

    expect(app.component).toHaveBeenCalledWith('MoeConfigProvider', expect.any(Object))
  })
})
