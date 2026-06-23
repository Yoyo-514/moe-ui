import { withInstall } from '@moe-ui/utils'

import ConfigProvider from './src/ConfigProvider.vue'

export const MoeConfigProvider = withInstall(ConfigProvider)

export * from './src/constants'
export * from './src/types'
export { provideGlobalConfig, useGlobalConfig } from './src/use-config'
