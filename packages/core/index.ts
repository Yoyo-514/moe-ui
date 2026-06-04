import '@moe-ui/theme/index.scss'
import { makeInstaller } from '@moe-ui/utils'
import components from './components'
import { printLogo } from './printLogo'
import type { App, Plugin } from 'vue'

const installComponents = makeInstaller(components) as (app: App) => void

const installer = ((app: App) => {
  printLogo()
  installComponents(app)
}) as Plugin

export * from '@moe-ui/components'
export default installer
