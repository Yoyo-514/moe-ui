import '@moe-ui/theme/index.scss'
import { makeInstaller } from '@moe-ui/utils'
import components from './components'

const installer = makeInstaller(components)

export * from '@moe-ui/components'
export default installer
