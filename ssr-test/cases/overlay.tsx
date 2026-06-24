/* eslint-disable vue/one-component-per-file */
import { defineComponent } from 'vue'

import {
  MoeDropdown,
  MoeDropdownItem,
  MoeDropdownMenu,
  MoePopconfirm,
  MoeTooltip,
} from '@moe-ui/components'

export default {
  name: 'overlay components',
  expects: ['tooltip trigger', 'popconfirm trigger', 'dropdown trigger'],
  component: defineComponent({
    setup() {
      return () => (
        <section class="ssr-overlay-case">
          <MoeTooltip content="Tooltip content">
            <button type="button">tooltip trigger</button>
          </MoeTooltip>
          <MoePopconfirm title="Confirm SSR">
            {{
              reference: () => <button type="button">popconfirm trigger</button>,
            }}
          </MoePopconfirm>
          <MoeDropdown>
            {{
              default: () => <button type="button">dropdown trigger</button>,
              dropdown: () => (
                <MoeDropdownMenu>
                  <MoeDropdownItem command="copy">Copy</MoeDropdownItem>
                </MoeDropdownMenu>
              ),
            }}
          </MoeDropdown>
        </section>
      )
    },
  }),
}
