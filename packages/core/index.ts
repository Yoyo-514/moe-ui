import '@yoyo-ui/theme/index.css'
import { makeInstaller } from '@yoyo-ui/utils'
import components from './components'

const installer = makeInstaller(components)

export * from 'yoyo-ui/components'
export default installer
