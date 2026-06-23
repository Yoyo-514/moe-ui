import type { App, MaybeRef, Ref } from 'vue'
import { computed, getCurrentInstance, inject, provide, ref, unref } from 'vue'

import { merge } from 'lodash-es'

import { localeContextKey, SIZE_INJECTION_KEY, Z_INDEX_INJECTION_KEY } from '@moe-ui/hooks'

import { debugWarn } from '@moe-ui/utils'

import { configProviderContextKey, type ConfigProviderContext } from './constants'

const globalConfig = ref<ConfigProviderContext>()

export function useGlobalConfig(): Ref<ConfigProviderContext>
export function useGlobalConfig<
  K extends keyof ConfigProviderContext,
  D extends ConfigProviderContext[K],
>(key: K, defaultValue?: D): Ref<Exclude<ConfigProviderContext[K], undefined> | D>
export function useGlobalConfig(key?: keyof ConfigProviderContext, defaultValue = undefined) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig

  if (key) {
    return computed(() => config.value?.[key] ?? defaultValue)
  } else {
    return config
  }
}

export function provideGlobalConfig(
  config: MaybeRef<ConfigProviderContext>,
  app?: App,
  global = false
) {
  const inSetup = !!getCurrentInstance()
  const oldConfig = inSetup ? useGlobalConfig() : undefined

  const provideFn = app?.provide ?? (inSetup ? provide : undefined)

  if (!provideFn) {
    debugWarn('provideGlobalConfig', 'provideGlobalConfig() can only be used inside setup().')

    return
  }

  const context = computed(() => {
    const cfg = unref(config)

    if (!oldConfig?.value) return cfg

    return merge({}, oldConfig.value, cfg)
  })

  provideFn(configProviderContextKey, context)
  provideFn(
    localeContextKey,
    computed(() => context.value.locale)
  )

  provideFn(Z_INDEX_INJECTION_KEY, {
    zIndex: computed(() => context.value.zIndex),
  })

  provideFn(SIZE_INJECTION_KEY, {
    size: computed(() => context.value.size || ''),
  })

  if (global || !globalConfig.value) {
    globalConfig.value = context.value
  }

  return context
}
