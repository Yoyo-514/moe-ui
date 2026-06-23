import { ElementPlusContainer } from '@vitepress-demo-preview/component'
import MoeCuteUI from 'moe-cute-ui'
import Teek from 'vitepress-theme-teek'

import type { Theme } from 'vitepress'

import '@vitepress-demo-preview/component/dist/style.css'
import 'moe-cute-ui/style.css'
import 'vitepress-theme-teek/index.css'
import './style.css'

export default {
  extends: Teek,
  enhanceApp({ app }) {
    app.use(MoeCuteUI)
    app.component('DemoPreview', ElementPlusContainer)
  },
} satisfies Theme
