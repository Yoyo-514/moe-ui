<script setup lang="ts">
import { provideGlobalConfig } from './use-config'
import type { ConfigProviderContext } from './types'

defineOptions({
  name: 'MoeConfigProvider',
})

const props = defineProps<ConfigProviderContext>()

const config = provideGlobalConfig(props)
</script>

<template>
  <slot name="default" :config="config"></slot>
</template>
