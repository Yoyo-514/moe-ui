import { computed } from 'vue'
import { translate, zhCn } from '@moe-ui/locale'
import { useGlobalConfig } from './use-config'
import type { TranslateValues } from '@moe-ui/locale'

export function useLocale() {
  const locale = useGlobalConfig('locale', zhCn)

  const lang = computed(() => locale.value.name)

  function t(path: string, values?: TranslateValues) {
    return translate(locale.value, path, values)
  }

  return {
    lang,
    locale,
    t,
  }
}
