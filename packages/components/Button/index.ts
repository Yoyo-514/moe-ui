import { withInstall } from '@moe-ui/utils'
import Button from './Button.vue'
import ButtonGroup from './ButtonGroup.vue'
import './style.scss'

export const MoeButton = withInstall(Button)
export const MoeButtonGroup = withInstall(ButtonGroup)

export * from './types'
