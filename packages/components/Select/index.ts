import { withInstall } from '@moe-ui/utils'
import Select from './Select.vue'
import Option from './Option.vue'
import './style.scss'

export const MoeSelect = withInstall(Select)
export const MoeOption = withInstall(Option)
export * from './types'
