import { withInstall } from '@moe-ui/utils'
import Collapse from './src/Collapse.vue'
import CollapseItem from './src/CollapseItem.vue'
import './style/index.scss'

export const MoeCollapse = withInstall(Collapse)
export const MoeCollapseItem = withInstall(CollapseItem)

export * from './src/types'
