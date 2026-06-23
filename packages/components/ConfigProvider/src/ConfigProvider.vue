<script setup lang="ts">
import { provideGlobalConfig } from './use-config'

import type { ConfigProviderProps } from './types'

defineOptions({
  name: 'MoeConfigProvider',
})

const props = defineProps<ConfigProviderProps>()

const config = provideGlobalConfig(props)
</script>

<template>
  <slot name="default" :config="config"></slot>
</template>
