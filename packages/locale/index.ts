export { default as en } from './lang/en'
export { default as zhCn } from './lang/zh-cn'

export type TranslatePair = {
  [key: string]: string | string[] | TranslatePair
}

export type Language = {
  name: string
  moe: TranslatePair
}

export type TranslateValues = Record<string, string | number>

function getValueByPath(source: TranslatePair, path: string) {
  return path.split('.').reduce<TranslatePair | string | string[] | undefined>((value, key) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
    return value[key]
  }, source)
}

function format(message: string, values?: TranslateValues) {
  if (!values) return message

  return message.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`))
}

export function translate(locale: Language, path: string, values?: TranslateValues) {
  const value = getValueByPath(locale.moe, path)

  if (typeof value !== 'string') return path

  return format(value, values)
}
