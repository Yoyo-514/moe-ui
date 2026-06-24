import { computed, createApp, defineComponent, h, provide, ref } from 'vue'

import { describe, expect, it } from 'vitest'

import { en, translate as rawTranslate, zhCn } from '@moe-ui/locale'

import {
  buildLocaleContext,
  buildTranslator,
  localeContextKey,
  translate,
  useLocale,
} from '../use-locale'

const renderText = (component: ReturnType<typeof defineComponent>) => {
  const container = document.createElement('div')
  const app = createApp(component)
  app.mount(container)
  const text = container.textContent ?? ''
  app.unmount()
  return text
}

describe('useLocale', () => {
  it('translates nested locale keys and keeps unknown placeholders', () => {
    const locale = {
      name: 'test',
      moe: {
        hello: '你好 {name} {missing}',
        nested: {
          text: '嵌套文本',
        },
        list: ['a'],
      },
    }

    expect(rawTranslate(locale, 'hello', { name: '小汐' })).toBe('你好 小汐 {missing}')
    expect(rawTranslate(locale, 'nested.text')).toBe('嵌套文本')
    expect(rawTranslate(locale, 'nested')).toBe('nested')
    expect(rawTranslate(locale, 'list.0')).toBe('list.0')
    expect(rawTranslate(locale, 'missing.path')).toBe('missing.path')
  })

  it('builds translator and locale context from plain object and ref locale', () => {
    const locale = ref(en)
    const translator = buildTranslator(locale)
    const context = buildLocaleContext(locale)

    expect(translator('select.placeholder')).toBe('Select')
    expect(context.lang.value).toBe('en')

    locale.value = zhCn
    expect(context.lang.value).toBe('zh-cn')
    expect(context.t('select.placeholder')).toBe('请选择')

    const plainContext = buildLocaleContext(zhCn)
    expect(plainContext.locale.value).toEqual(zhCn)
  })

  it('uses provided locale and falls back to zh-cn when override is empty', () => {
    const Child = defineComponent({
      setup() {
        const { lang, t } = useLocale()
        return () => h('span', `${lang.value}:${t('select.noData')}`)
      },
    })
    const Root = defineComponent({
      setup() {
        provide(
          localeContextKey,
          computed(() => en)
        )
        return () => h(Child)
      },
    })

    expect(renderText(Root)).toBe('en:No data')

    const EmptyOverrideChild = defineComponent({
      setup() {
        const { lang, t } = useLocale(ref())
        return () => h('span', `${lang.value}:${t('select.noData')}`)
      },
    })

    expect(renderText(EmptyOverrideChild)).toBe('zh-cn:暂无数据')
  })

  it('formats hook translator with explicit values', () => {
    const locale = {
      name: 'test',
      moe: {
        message: 'Hello {name}',
      },
    }

    expect(translate('message', { name: 'Moe' }, locale)).toBe('Hello Moe')
    expect(translate('message', undefined, locale)).toBe('Hello {name}')
    expect(translate('missing.path', undefined, locale)).toBe('missing.path')
  })
})
