/* eslint-disable vue/one-component-per-file */
import { defineComponent } from 'vue'

import { MoeAlert, MoeButton, MoeButtonGroup, MoeConfigProvider } from '@moe-ui/components'

import { en } from '@moe-ui/locale'

export default {
  name: 'basic components',
  expects: ['SSR Button', 'Grouped Next', 'SSR Alert'],
  component: defineComponent({
    setup() {
      return () => (
        <MoeConfigProvider locale={en} size="small" zIndex={3000}>
          <section class="ssr-basic-case">
            <MoeButton type="primary">SSR Button</MoeButton>
            <MoeButtonGroup type="success">
              <MoeButton>Grouped Prev</MoeButton>
              <MoeButton>Grouped Next</MoeButton>
            </MoeButtonGroup>
            <MoeAlert title="SSR Alert" type="success" showIcon />
          </section>
        </MoeConfigProvider>
      )
    },
  }),
}
