import { withInstall } from '@moe-ui/utils'
import Dropdown from './src/Dropdown.vue'
import DropdownItem from './src/DropdownItem.vue'
import DropdownMenu from './src/DropdownMenu.vue'
import './style/index.scss'

export const MoeDropdown = withInstall(Dropdown)
export const MoeDropdownItem = withInstall(DropdownItem)
export const MoeDropdownMenu = withInstall(DropdownMenu)

export * from './src/types'
