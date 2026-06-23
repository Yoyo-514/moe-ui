import { withInstall } from '@moe-ui/utils'

import Button from './src/Button.vue'
import ButtonGroup from './src/ButtonGroup.vue'

export const MoeButton = withInstall(Button)
export const MoeButtonGroup = withInstall(ButtonGroup)

export * from './src/types'
