import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { MoeButton, MoeButtonGroup, MoeIcon } from '../../../components'
import DemoBlock from '../components/DemoBlock.vue'
import '../../../theme/index.scss'
import './style.scss'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(MoeButton)
    app.use(MoeButtonGroup)
    app.use(MoeIcon)
    app.component('DemoBlock', DemoBlock)
  },
} satisfies Theme
