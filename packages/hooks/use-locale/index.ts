import type { InjectionKey, MaybeRef, Ref } from 'vue'
import { computed, inject, isRef, ref, unref } from 'vue'

import { get } from 'lodash-es'

import type { FieldPath } from '@moe-ui/utils'

import type { Language } from '@moe-ui/locale'
import { zhCn } from '@moe-ui/locale'

export type LocaleKeys =
  | Exclude<FieldPath<typeof zhCn>, 'name' | 'moe'>
  | (string & NonNullable<unknown>)

export type TranslatorOption = Record<string, string | number>
export type Translator = (path: LocaleKeys, option?: TranslatorOption) => string
export type LocaleContext = {
  locale: Ref<Language>
  lang: Ref<string>
  t: Translator
}

export const buildTranslator =
  (locale: MaybeRef<Language>): Translator =>
  (path, option) =>
    translate(path, option, unref(locale))

export const translate = (
  path: LocaleKeys,
  option: undefined | TranslatorOption,
  locale: Language
): string =>
  (get(locale.moe, path, path) as string).replace(
    /\{(\w+)\}/g,
    (_, key) => `${option?.[key] ?? `{${key}}`}`
  )

export const buildLocaleContext = (locale: MaybeRef<Language>): LocaleContext => {
  const lang = computed(() => unref(locale).name)
  const localeRef = isRef(locale) ? locale : ref(locale)
  return {
    lang,
    locale: localeRef,
    t: buildTranslator(locale),
  }
}

export const localeContextKey: InjectionKey<Ref<Language | undefined>> = Symbol('localeContextKey')

export const useLocale = (localeOverrides?: Ref<Language | undefined>) => {
  const locale = localeOverrides || inject(localeContextKey, ref())!
  return buildLocaleContext(computed(() => locale.value || zhCn))
}
