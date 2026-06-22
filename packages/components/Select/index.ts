import { withInstall } from '@moe-ui/utils'
import Select from './src/Select.vue'
import Option from './src/Option.vue'
import './style/index.scss'

export const MoeSelect = withInstall(Select)
export const MoeOption = withInstall(Option)
export * from './src/types'
