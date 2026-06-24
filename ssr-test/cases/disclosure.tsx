/* eslint-disable vue/one-component-per-file */
import { defineComponent } from 'vue'

import { MoeCollapse, MoeCollapseItem } from '@moe-ui/components'

export default {
  name: 'disclosure components',
  expects: ['Intro', 'SSR Collapse Content'],
  component: defineComponent({
    setup() {
      return () => (
        <section class="ssr-disclosure-case">
          <MoeCollapse modelValue={['intro']}>
            <MoeCollapseItem name="intro" title="Intro">
              SSR Collapse Content
            </MoeCollapseItem>
          </MoeCollapse>
        </section>
      )
    },
  }),
}
