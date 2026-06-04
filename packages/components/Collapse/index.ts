import { withInstall } from '@moe-ui/utils'
import Collapse from './Collapse.vue'
import CollapseItem from './CollapseItem.vue'
import './style.scss'

export const MoeCollapse = withInstall(Collapse)
export const MoeCollapseItem = withInstall(CollapseItem)

export * from './types'
