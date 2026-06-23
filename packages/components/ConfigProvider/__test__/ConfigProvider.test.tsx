/* eslint-disable vue/one-component-per-file */
import { defineComponent, h } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { useGlobalSize, useLocale } from '@moe-ui/hooks'

import { en } from '@moe-ui/locale'

import { MoeConfigProvider, useGlobalConfig } from '../index'

const LocaleConsumer = defineComponent({
  setup() {
    const { lang, t } = useLocale()

    return () => (
      <div class="locale-consumer">
        <span class="lang">{lang.value}</span>
        <span class="placeholder">{t('select.placeholder')}</span>
      </div>
    )
  },
})

const Consumer = defineComponent({
  setup() {
    const config = useGlobalConfig()
    const size = useGlobalSize()
    const zIndex = useGlobalConfig('zIndex')

    return () => (
      <div class="consumer">
        <span class="size">{size.value}</span>
        <span class="z-index">{zIndex.value}</span>
        <span class="config">{JSON.stringify(config.value)}</span>
      </div>
    )
  },
})

describe('ConfigProvider.vue', () => {
  it('falls back to defaults without provider', () => {
    const wrapper = mount(Consumer)

    expect(wrapper.get('.size').text()).toBe('')
    expect(wrapper.get('.z-index').text()).toBe('')
  })

  it('provides size and zIndex to descendants', () => {
    const wrapper = mount(MoeConfigProvider, {
      props: {
        size: 'small',
        zIndex: 3000,
      },
      slots: {
        default: () => <Consumer />,
      },
    })

    expect(wrapper.get('.size').text()).toBe('small')
    expect(wrapper.get('.z-index').text()).toBe('3000')
  })

  it('merges nested config providers', () => {
    const wrapper = mount(MoeConfigProvider, {
      props: {
        size: 'large',
        zIndex: 2000,
      },
      slots: {
        default: () => h(MoeConfigProvider, { size: 'small' }, { default: () => <Consumer /> }),
      },
    })

    expect(wrapper.get('.size').text()).toBe('small')
    expect(wrapper.get('.z-index').text()).toBe('2000')
  })

  it('provides locale to descendants', () => {
    const wrapper = mount(MoeConfigProvider, {
      props: { locale: en },
      slots: {
        default: () => <LocaleConsumer />,
      },
    })

    expect(wrapper.get('.lang').text()).toBe('en')
    expect(wrapper.get('.placeholder').text()).toBe('Select')
  })

  it('exposes config through scoped slot', () => {
    const wrapper = mount(MoeConfigProvider, {
      props: { size: 'large', zIndex: 5000 },
      slots: {
        default: (scope: Record<string, unknown>) =>
          h('span', { class: 'result' }, JSON.stringify(scope.config)),
      },
    })

    const parsed = JSON.parse(wrapper.get('.result').text())

    expect(parsed.size).toBe('large')
    expect(parsed.zIndex).toBe(5000)
  })

  it('installs as a Vue plugin', () => {
    const app = { component: vi.fn() }

    MoeConfigProvider.install?.(app as never)

    expect(app.component).toHaveBeenCalledWith('MoeConfigProvider', expect.any(Object))
  })
})
