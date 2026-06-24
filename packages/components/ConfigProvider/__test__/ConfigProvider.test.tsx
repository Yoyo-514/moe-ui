/* eslint-disable vue/one-component-per-file */
import { defineComponent, h } from 'vue'

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useGlobalSize, useLocale } from '@moe-ui/hooks'

import { en } from '@moe-ui/locale'

import { MoeConfigProvider, provideGlobalConfig, useGlobalConfig } from '../index'

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
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('falls back to defaults without provider and supports default config value', () => {
    const wrapper = mount(Consumer)
    const zIndexWithDefault = useGlobalConfig('zIndex', 1000)

    expect(wrapper.get('.size').text()).toBe('')
    expect(wrapper.get('.z-index').text()).toBe('')
    expect(zIndexWithDefault.value).toBe(1000)
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

  it('warns when provideGlobalConfig is called outside setup without app', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(provideGlobalConfig({ size: 'small' })).toBeUndefined()
    expect(warn).toHaveBeenCalledOnce()
    expect((warn.mock.calls[0]?.[0] as Error).message).toBe(
      '[provideGlobalConfig]: provideGlobalConfig() can only be used inside setup().'
    )
  })

  it('provides config through app instance and can set global config', () => {
    const app = { provide: vi.fn() }
    const context = provideGlobalConfig({ size: 'small', zIndex: 6000 }, app as never, true)
    const globalSize = useGlobalConfig('size')

    expect(context?.value.size).toBe('small')
    expect(context?.value.zIndex).toBe(6000)
    expect(app.provide).toHaveBeenCalledTimes(4)
    expect(globalSize.value).toBe('small')
  })

  it('installs as a Vue plugin', () => {
    const app = { component: vi.fn() }

    MoeConfigProvider.install?.(app as never)

    expect(app.component).toHaveBeenCalledWith('MoeConfigProvider', expect.any(Object))
  })
})
