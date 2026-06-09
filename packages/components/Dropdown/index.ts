import { withInstall } from '@moe-ui/utils'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import DropdownMenu from './DropdownMenu.vue'
import './style.scss'

export const MoeDropdown = withInstall(Dropdown)
export const MoeDropdownItem = withInstall(DropdownItem)
export const MoeDropdownMenu = withInstall(DropdownMenu)

export * from './types'
