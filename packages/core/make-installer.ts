import type { App, Plugin } from 'vue'

import type { ConfigProviderContext } from '@moe-ui/components'
import { provideGlobalConfig } from '@moe-ui/components'

import { INSTALLED_KEY } from '@moe-ui/constants'

import { printLogo } from './printLogo'

export function makeInstaller(components: Plugin[] = []) {
  const install = (app: App, options?: ConfigProviderContext) => {
    const appRecord = app as App & Record<symbol, boolean>

    if (appRecord[INSTALLED_KEY]) return

    appRecord[INSTALLED_KEY] = true

    printLogo()
    components.forEach((component) => app.use(component))

    if (options) provideGlobalConfig(options, app, true)
  }

  return {
    install,
  } satisfies Plugin
}
