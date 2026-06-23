import { withInstall } from '@moe-ui/utils'

import Option from './src/Option.vue'
import Select from './src/Select.vue'

export const MoeSelect = withInstall(Select)
export const MoeOption = withInstall(Option)
export * from './src/types'
